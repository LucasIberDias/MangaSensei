package MangaSensei.service;

import org.springframework.stereotype.Service;

import MangaSensei.repository.ColecaoRepository;
import MangaSensei.repository.ItemRepository;

@Service 
public class ColecaoService {
    private final ColecaoRepository colecaoRepository;
    private final ItemRepository itemRepository;

    public ColecaoService(ColecaoRepository colecaoRepository, ItemRepository itemRepository){
        this.colecaoRepository = colecaoRepository;
        this.itemRepository = itemRepository;
    }

    // UC08 - Criar Coleção
    
}
