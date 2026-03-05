package com.ameqran.serenica.domain.repository;

import com.ameqran.serenica.domain.model.Patient;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PatientRepository extends JpaRepository<Patient, UUID> {

    long countByActiveTrue();

    List<Patient> findAllByOrderByLastNameAscFirstNameAsc();

    @Query("""
        select p from Patient p
        where lower(concat(p.firstName, ' ', p.lastName)) like lower(concat('%', :search, '%'))
           or lower(p.code) like lower(concat('%', :search, '%'))
           or lower(coalesce(p.primaryConcern, '')) like lower(concat('%', :search, '%'))
        order by p.lastName asc, p.firstName asc
        """)
    List<Patient> search(@Param("search") String search);
}
