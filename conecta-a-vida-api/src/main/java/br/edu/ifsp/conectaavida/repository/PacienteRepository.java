package br.edu.ifsp.conectaavida.repository;

import br.edu.ifsp.conectaavida.domain.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    Optional<Paciente> findByCpf(String cpf);
}