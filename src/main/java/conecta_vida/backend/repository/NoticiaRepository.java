package conecta_vida.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import conecta_vida.backend.models.Noticia;
import java.util.List;


public interface NoticiaRepository extends JpaRepository<Noticia, Integer> {

    //filtrar por categorias
    List<Noticia> findByCategoria(String categoria);
    
    //filtrar por localizacao relevante ao usuario
    List<Noticia> findByLocalizacao(String localizacao);
    
}