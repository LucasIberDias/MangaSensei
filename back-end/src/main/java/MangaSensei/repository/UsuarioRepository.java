package MangaSensei.repository;

import MangaSensei.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer>{
    boolean existsByEmail(String email);

    boolean existsByNome(String nome);

    Optional<Usuario> findByEmail(String email);

}
