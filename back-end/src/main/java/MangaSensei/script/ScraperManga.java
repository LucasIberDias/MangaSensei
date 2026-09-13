package MangaSensei.script;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.stereotype.Service;

import MangaSensei.model.Manga;
import MangaSensei.model.VolumeManga;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Service
public class ScraperManga {

    public Manga buscarManga(String tituloManga) {

        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-gpu");
        options.addArguments("--window-size=1920,1080");

        ChromeDriver driver = new ChromeDriver(options);
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        try {
            // 1 - Entra no site
            driver.get("https://mundosinfinitos.com.br/");

            // 2 - Entra na barra de pesquisa
            WebElement barra = wait.until(
                    ExpectedConditions.presenceOfElementLocated(By.id("search2_txt"))
            );

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
            wait.until(
                    ExpectedConditions.elementToBeClickable(By.cssSelector("a[href*='/geek/colecao/']"))
            ).click();

            // 6 - pega o titulo do manga
            String titulo = wait.until(
                    ExpectedConditions.presenceOfElementLocated(By.className("titulo-categoria"))
            ).getText();

            // 7 - coloca em ordem crescente
            WebElement ordenador = wait.until(
                    ExpectedConditions.presenceOfElementLocated(
                            By.id("ConteudoBodyMaster_ConteudoCorpo_CtlResultadoBusca_ddlOrdenacao"))
            );
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
            throw new RuntimeException("Manga nao encontrado");

        } finally {
            driver.quit();
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