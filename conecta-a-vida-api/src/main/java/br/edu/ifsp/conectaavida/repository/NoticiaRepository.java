package br.edu.ifsp.conectaavida.repository;

import br.edu.ifsp.conectaavida.domain.Noticia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Atenção equipe: O segundo parâmetro do JpaRepository define o tipo do ID.
// Como o ID de Noticia é Integer, declaramos <Noticia, Integer> aqui.
@Repository
public interface NoticiaRepository extends JpaRepository<Noticia, Integer> {
}