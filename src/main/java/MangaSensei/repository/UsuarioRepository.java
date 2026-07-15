package MangaSensei.repository;

import MangaSensei.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer>{
    boolean existsByEmail(String email);

    boolean existsByNome(String nome);
}
