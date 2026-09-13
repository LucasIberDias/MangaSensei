"""
Scraper de manga - mundosinfinitos.com.br

Uso (via linha de comando / chamado pelo Java com ProcessBuilder):
    python scraper_manga.py "One Piece"

Saida (stdout):
    - Sucesso: um UNICO JSON com os dados do manga, encerrando com exit code 0
    - Nao encontrado / erro: um UNICO JSON {"erro": "..."} , encerrando com exit code 1
    
"""

import sys
import re
import json

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException


def log(*args):
    print(*args, file=sys.stderr)


def montar_driver():
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    return webdriver.Chrome(options=options)


def pegar_texto_primeiro(elementos, default=""):
    return next((e.text.strip() for e in elementos if e.text.strip()), default)


def pegar_capa(driver):
    """Pega a 2a imagem do carrossel de thumbs (a 1a costuma ser selo/logo genérico)."""
    imagens = driver.find_elements(By.CSS_SELECTOR, "button.owl-thumb-item img")
    if not imagens:
        return ""
    if len(imagens) >= 2:
        return imagens[1].get_attribute("src")
    return imagens[0].get_attribute("src")


def buscar_manga(nome_manga: str) -> dict:
    driver = montar_driver()

    try:
        # 1 - Entra no site
        driver.get("https://mundosinfinitos.com.br/")

        # 2 - Entra na barra de pesquisa
        barra = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "search2_txt"))
        )

        # 3 - Coloca o manga pesquisado
        barra.send_keys(nome_manga)
        barra.send_keys(Keys.ENTER)

        # Se nao houver nenhum resultado, isso estoura TimeoutException
        # e cai no except la embaixo -> retornamos "nao encontrado"
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "box-produto"))
        )

        # 4 - Entra no primeiro manga
        primeiro_manga = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".box-produto .img-capa a"))
        )
        driver.get(primeiro_manga.get_attribute("href"))

        # 5 - coloca todas as edicoes
        WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "a[href*='/geek/colecao/']"))
        ).click()

        # 6 - pega o titulo do manga
        titulo_manga = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "titulo-categoria"))
        ).text
        log("Titulo:", titulo_manga)

        # 7 - coloca em ordem crescente
        ordenador = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.ID, "ConteudoBodyMaster_ConteudoCorpo_CtlResultadoBusca_ddlOrdenacao")
            )
        )
        Select(ordenador).select_by_value("8")

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "box-produto"))
        )

        # 8 - entra no primeiro volume (o primeiro da lista ja em ordem crescente)
        nvm_primeiro_manga = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".box-produto .img-capa a"))
        )
        link = nvm_primeiro_manga.get_attribute("href")
        driver.get(link)

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )

        # 9 - pega capa
        imagem = pegar_capa(driver)
        log("Capa:", imagem)

        # 10 - pega autor
        autores = driver.find_elements(By.XPATH, "//li[contains(., 'Autor')]//a")
        autor = pegar_texto_primeiro(autores, "Desconhecido")
        log("Autor:", autor)

        # 11 - pega editora
        editoras = driver.find_elements(By.XPATH, "//li[strong[contains(text(),'Editora')]]/a")
        editora = pegar_texto_primeiro(editoras, "Desconhecida")
        log("Editora:", editora)

        # 12 - pega a demografia
        demografias = driver.find_elements(By.XPATH, "//li[strong[contains(text(),'Demografia')]]/a")
        demografia = pegar_texto_primeiro(demografias, "Desconhecida")
        log("Demografia:", demografia)

        # 13 - pega a quantidade de volumes
        driver.back()
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "box-produto"))
        )

        volumes_na_pagina = driver.find_elements(By.CLASS_NAME, "num-edicao")
        qntd_volumes = len(volumes_na_pagina)
        log("Quantidade de volumes:", qntd_volumes)

        # 14 a 17 - coleta capa + isbn de cada volume
        elementos_volumes = driver.find_elements(By.CSS_SELECTOR, ".box-produto .img-capa a")
        links_volumes = [v.get_attribute("href") for v in elementos_volumes]

        lista_volumes = []

        for i, link_volume in enumerate(links_volumes):
            driver.get(link_volume)
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )

            capa_volume = pegar_capa(driver)

            isbn_bruto = driver.find_elements(By.XPATH, "//li[strong[contains(text(),'ISBN')]]")
            isbn_texto = isbn_bruto[0].text if isbn_bruto else ""
            isbn = re.sub(r"\D", "", isbn_texto)

            log(f"Volume {i + 1} -> Capa: {capa_volume} | ISBN: {isbn}")

            lista_volumes.append({
                "capaVolume": capa_volume,
                "isbnVolume": isbn
            })

            driver.back()
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "box-produto"))
            )

        dados_manga = {
            "tituloManga": titulo_manga,
            "autorManga": autor,
            "editoraManga": editora,
            "demografiaManga": demografia,
            "capaManga": imagem,
            "quantidadeVolumes": qntd_volumes,
            "volumes": lista_volumes
        }

        return dados_manga

    finally:
        driver.quit()


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"erro": "Nome do manga nao informado"}, ensure_ascii=False))
        sys.exit(1)

    nome_manga = sys.argv[1]

    try:
        dados = buscar_manga(nome_manga)
        # UNICA coisa que vai pro stdout: o JSON de sucesso
        print(json.dumps(dados, ensure_ascii=False))
        sys.exit(0)

    except TimeoutException:
        print(json.dumps({"erro": "Manga nao encontrado"}, ensure_ascii=False))
        sys.exit(1)

    except NoSuchElementException:
        print(json.dumps({"erro": "Manga nao encontrado"}, ensure_ascii=False))
        sys.exit(1)

    except Exception as e:
        log("Erro inesperado:", str(e))
        print(json.dumps({"erro": f"Falha ao buscar manga: {str(e)}"}, ensure_ascii=False))
        sys.exit(1)


if __name__ == "__main__":
    main()