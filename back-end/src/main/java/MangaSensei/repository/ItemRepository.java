package MangaSensei.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import MangaSensei.model.Item;

public interface ItemRepository extends JpaRepository<Item, Long> {

    //Vai calcular a quantidade de itens de uma colecao
    long countByColecao_IdColecao(Long idColecao);

    // Apaga todos os itens das colecoes de um usuario
    void deleteByColecao_Usuario_IdUsuario(Long idUsuario);
}