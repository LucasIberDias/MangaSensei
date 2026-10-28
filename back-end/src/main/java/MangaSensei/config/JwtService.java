package MangaSensei.config;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    private static final Base64.Encoder ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder DECODER = Base64.getUrlDecoder();
    private static final long TOKEN_LIFETIME_SECONDS = 60 * 60 * 8;

    private final byte[] secret;
    private final ObjectMapper objectMapper;

    public JwtService(@Value("${app.jwt.secret}") String secret, ObjectMapper objectMapper) {
        if (secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalArgumentException("app.jwt.secret deve possuir pelo menos 32 bytes.");
        }
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.objectMapper = objectMapper;
    }

    public String gerarToken(Long idUsuario) {
        try {
            String header = codificar(objectMapper.writeValueAsBytes(Map.of("alg", "HS256", "typ", "JWT")));
            long expiracao = Instant.now().plusSeconds(TOKEN_LIFETIME_SECONDS).getEpochSecond();
            String payload = codificar(objectMapper.writeValueAsBytes(Map.of(
                    "sub", idUsuario.toString(), "iat", Instant.now().getEpochSecond(), "exp", expiracao)));
            String conteudo = header + "." + payload;
            return conteudo + "." + codificar(assinar(conteudo));
        } catch (Exception exception) {
            throw new IllegalStateException("Não foi possível gerar o token.", exception);
        }
    }

    public Long validarToken(String token) {
        try {
            String[] partes = token.split("\\.");
            if (partes.length != 3) return null;

            String conteudo = partes[0] + "." + partes[1];
            byte[] assinaturaRecebida = DECODER.decode(partes[2]);
            if (!MessageDigest.isEqual(assinar(conteudo), assinaturaRecebida)) return null;

            Map<?, ?> claims = objectMapper.readValue(DECODER.decode(partes[1]), Map.class);
            if (!(claims.get("exp") instanceof Number expiracao)
                    || expiracao.longValue() <= Instant.now().getEpochSecond()) return null;
            return Long.valueOf((String) claims.get("sub"));
        } catch (Exception exception) {
            return null;
        }
    }

    private byte[] assinar(String conteudo) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret, "HmacSHA256"));
        return mac.doFinal(conteudo.getBytes(StandardCharsets.UTF_8));
    }

    private String codificar(byte[] valor) {
        return ENCODER.encodeToString(valor);
    }
}
