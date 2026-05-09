package conecta_vida.backend.services;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import conecta_vida.backend.models.Noticia;
import conecta_vida.backend.repository.NoticiaRepository;
import conecta_vida.backend.repository.OrgaoSaudeRepository;

@Service
public class NoticiaService {

    @Autowired
    private NoticiaRepository noticiaRepository;

    @Autowired
    private OrgaoSaudeRepository orgaoSaudeRepository;

    public Noticia cadastrarNoticia(Noticia novaNoticia){
        //checa se orgao existe
        if (novaNoticia.getOrgao() == null || novaNoticia.getOrgao().getId() == null){
            throw new IllegalArgumentException("A notícia precisa estar vinculada a algum órgão");
        }
        if (!orgaoSaudeRepository.existsById(novaNoticia.getOrgao().getId())) {
            throw new IllegalArgumentException("Órgão de Saúde não encontrado.");
        }

        //checa se a data de vencimento é válida
        if (novaNoticia.getDataVencimento() == null || novaNoticia.getDataVencimento().isBefore(LocalDateTime.now())){
            throw new IllegalArgumentException("Data de vencimento inválida.");
        }

        //define datapostada como agr e depois salva
        novaNoticia.setDataPostada(LocalDateTime.now());
        Noticia noticiaSalva = noticiaRepository.save(novaNoticia);

        //checa se é urgente/epidemia pra mandar notif
        if (noticiaSalva.getCategoria().equalsIgnoreCase("Epidemia") || 
            noticiaSalva.getCategoria().equalsIgnoreCase("Urgência")) {
            dispararNotificacaoPush(noticiaSalva);
        }
        
        return noticiaSalva;
    }

    private void dispararNotificacaoPush(Noticia noticia) {
        System.out.println("==================================================");
        System.out.println("🚨 ALERTA ENVIADO PARA OS CELULARES!");
        System.out.println("Região: " + noticia.getLocalizacao());
        System.out.println("Noticia: " + noticia.getTitulo());
        System.out.println("==================================================");
    }
}
