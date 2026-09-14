package MangaSensei.script;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.ElementNotInteractableException;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import MangaSensei.model.Manga;
import MangaSensei.model.VolumeManga;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Service
public class ScraperManga {

    private static final Logger log = LoggerFactory.getLogger(ScraperManga.class);

    public Manga buscarManga(String tituloManga) {

        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-gpu");
        options.addArguments("--window-size=1920,1080");

        // Mascara sinais de automacao que muitos sites usam pra detectar/bloquear
        // bots (o headless "puro" costuma expor navigator.webdriver = true,
        // o que pode fazer o site nao renderizar a pagina completa/normal)
        options.addArguments("--disable-blink-features=AutomationControlled");
        options.setExperimentalOption("excludeSwitches", new String[]{"enable-automation"});
        options.setExperimentalOption("useAutomationExtension", false);
        options.addArguments(
                "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                        + "(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
        );

        ChromeDriver driver = new ChromeDriver(options);

        // Reforca a mascara via CDP, removendo o navigator.webdriver logo na largada
        ((JavascriptExecutor) driver).executeScript(
                "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
        );

        // Timeout maior so pro carregamento inicial do site (pode ser mais lento
        // que os passos seguintes, que ja navegam com o Chrome "aquecido")
        WebDriverWait waitInicial = new WebDriverWait(driver, Duration.ofSeconds(20));
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        try {
            // 1 - Entra no site
            driver.get("https://mundosinfinitos.com.br/");

            // 2 - Entra na barra de pesquisa
            // Usa o wait "inicial" (20s), com timeout maior, so nesta primeira espera -
            // e o ponto mais sensivel a lentidao de carregamento da pagina
            WebElement barra = waitInicial.until(
                    ExpectedConditions.visibilityOfElementLocated(By.id("search_txt"))
            );
            scrollParaElemento(driver, barra);

            // 3 - Coloca o manga pesquisado
            barra.sendKeys(tituloManga);
            barra.sendKeys(Keys.ENTER);

            // Se nao houver resultado, estoura TimeoutException aqui -> tratado no catch
            wait.until(ExpectedConditions.presenceOfElementLocated(By.className("box-produto")));

            // 4 - Entra no primeiro manga
            WebElement primeiroManga = wait.until(
                    ExpectedConditions.presenceOfElementLocated(By.cssSelector(".box-produto .img-capa a"))
            );
            driver.get(primeiroManga.getDomAttribute("href"));

            // 5 - coloca todas as edicoes
            // elementToBeClickable ja checa visibilidade + habilitado, mas o scroll + clique via JS
            // como fallback evita falha quando outro elemento (banner, header fixo) cobre o alvo
            WebElement linkColecao = wait.until(
                    ExpectedConditions.elementToBeClickable(By.cssSelector("a[href*='/geek/colecao/']"))
            );
            clicarComFallback(driver, linkColecao);

            // 6 - pega o titulo do manga
            String titulo = wait.until(
                    ExpectedConditions.presenceOfElementLocated(By.className("titulo-categoria"))
            ).getText();

            // 7 - coloca em ordem crescente
            // elementToBeClickable garante que o <select> ja esta visivel e habilitado antes de manipular
            WebElement ordenador = wait.until(
                    ExpectedConditions.elementToBeClickable(
                            By.id("ConteudoBodyMaster_ConteudoCorpo_CtlResultadoBusca_ddlOrdenacao"))
            );
            scrollParaElemento(driver, ordenador);
            new Select(ordenador).selectByValue("8");

            wait.until(ExpectedConditions.presenceOfElementLocated(By.className("box-produto")));

            // 8 - entra no primeiro manga (ja ordenado)
            WebElement nvmPrimeiroManga = wait.until(
                    ExpectedConditions.presenceOfElementLocated(By.cssSelector(".box-produto .img-capa a"))
            );
            driver.get(nvmPrimeiroManga.getDomAttribute("href"));

            wait.until(ExpectedConditions.presenceOfElementLocated(By.tagName("body")));

            // 9 - pega capa
            String capaManga = pegarCapa(driver);

            // 10 - pega autor
            String autor = pegarTextoPrimeiro(
                    driver.findElements(By.xpath("//li[contains(., 'Autor')]//a")), "Desconhecido");

            // 11 - pega editora
            String editora = pegarTextoPrimeiro(
                    driver.findElements(By.xpath("//li[strong[contains(text(),'Editora')]]/a")), "Desconhecida");

            // 12 - pega demografia
            String demografia = pegarTextoPrimeiro(
                    driver.findElements(By.xpath("//li[strong[contains(text(),'Demografia')]]/a")), "Desconhecida");

            // 13 - pega a quantidade de volumes
            driver.navigate().back();
            wait.until(ExpectedConditions.presenceOfElementLocated(By.className("box-produto")));

            List<WebElement> volumesNaPagina = driver.findElements(By.className("num-edicao"));
            long qntdVolumes = volumesNaPagina.size();

            // 14 a 17 - coleta capa + isbn de cada volume
            List<WebElement> elementosVolumes = driver.findElements(By.cssSelector(".box-produto .img-capa a"));
            List<String> linksVolumes = new ArrayList<>();
            for (WebElement v : elementosVolumes) {
                linksVolumes.add(v.getDomAttribute("href"));
            }

            // Monta a entidade Manga (ainda sem id - so eh gerado ao salvar)
            Manga manga = new Manga();
            manga.setTituloManga(titulo);
            manga.setAutorManga(autor);
            manga.setEditoraManga(editora);
            manga.setDemografiaManga(demografia);
            manga.setCapaManga(capaManga);
            manga.setQuantidadeVolumes(qntdVolumes);

            List<VolumeManga> volumes = new ArrayList<>();

            for (String linkVolume : linksVolumes) {
                driver.get(linkVolume);
                wait.until(ExpectedConditions.presenceOfElementLocated(By.tagName("body")));

                String capaVolume = pegarCapa(driver);

                List<WebElement> isbnBruto = driver.findElements(
                        By.xpath("//li[strong[contains(text(),'ISBN')]]"));
                String isbnTexto = isbnBruto.isEmpty() ? "" : isbnBruto.get(0).getText();
                String isbn = isbnTexto.replaceAll("\\D", "");

                VolumeManga volume = new VolumeManga();
                volume.setCapaVolume(capaVolume);
                volume.setIsbnVolume(isbn);
                volume.setManga(manga); // ja liga o FK aqui mesmo, antes de qualquer save

                volumes.add(volume);

                driver.navigate().back();
                wait.until(ExpectedConditions.presenceOfElementLocated(By.className("box-produto")));
            }

            manga.setVolumes(volumes);

            return manga;

        } catch (TimeoutException e) {
            // Loga a mensagem ORIGINAL do Selenium, que diz exatamente qual seletor/etapa
            // estourou o timeout - essencial pra debugar qual passo da navegacao falhou.
            log.warn("Timeout ao buscar manga '{}': {}", tituloManga, e.getMessage());
            salvarScreenshotDebug(driver, tituloManga);
            throw new MangaNaoEncontradoException("Manga nao encontrado");

        } catch (ElementNotInteractableException e) {
            // Elemento existe no DOM mas nao estava pronto pra interacao
            // (fora da tela, coberto por outro elemento, ainda invisivel, etc.)
            log.warn("Elemento nao interativo ao buscar manga '{}': {}", tituloManga, e.getMessage());
            throw new MangaNaoEncontradoException("Falha ao navegar no site do manga, tente novamente");

        } finally {
            driver.quit();
        }
    }

    /**
     * Rola a pagina ate o elemento ficar visivel na viewport.
     * Evita ElementNotInteractableException quando o elemento existe no DOM
     * mas esta fora da area visivel (o Selenium so interage com o que "enxerga").
     */
    private void scrollParaElemento(ChromeDriver driver, WebElement elemento) {
        ((JavascriptExecutor) driver).executeScript(
                "arguments[0].scrollIntoView({block: 'center'});", elemento
        );
    }

    /**
     * Tenta o clique normal do Selenium; se o site estiver com algum overlay/anim
     * impedindo o clique "real", cai para um clique via JavaScript como fallback.
     */
    private void clicarComFallback(ChromeDriver driver, WebElement elemento) {
        scrollParaElemento(driver, elemento);
        try {
            elemento.click();
        } catch (ElementNotInteractableException e) {
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", elemento);
        }
    }

    /**
     * Salva um print da tela no momento do timeout, em disco, pra debugar visualmente
     * o que o Chrome headless estava vendo (ex: pagina de bloqueio anti-bot, captcha,
     * layout diferente do esperado, pagina em branco, etc.).
     */
    private void salvarScreenshotDebug(ChromeDriver driver, String tituloManga) {
        try {
            byte[] screenshot = driver.getScreenshotAs(org.openqa.selenium.OutputType.BYTES);
            String nomeArquivo = "debug_scraper_" + System.currentTimeMillis() + ".png";
            java.nio.file.Path caminho = java.nio.file.Paths.get(nomeArquivo);
            java.nio.file.Files.write(caminho, screenshot);
            log.warn("Screenshot de debug salvo em: {}", caminho.toAbsolutePath());
        } catch (Exception ex) {
            log.warn("Nao foi possivel salvar screenshot de debug: {}", ex.getMessage());
        }
    }

    private String pegarCapa(ChromeDriver driver) {
        List<WebElement> imagens = driver.findElements(By.cssSelector("button.owl-thumb-item img"));
        if (imagens.isEmpty()) {
            return "";
        }
        if (imagens.size() >= 2) {
            return imagens.get(1).getDomAttribute("src");
        }
        return imagens.get(0).getDomAttribute("src");
    }

    private String pegarTextoPrimeiro(List<WebElement> elementos, String padrao) {
        for (WebElement e : elementos) {
            String texto = e.getText().trim();
            if (!texto.isEmpty()) {
                return texto;
            }
        }
        return padrao;
    }
}