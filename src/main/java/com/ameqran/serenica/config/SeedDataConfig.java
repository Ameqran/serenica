package com.ameqran.serenica.config;

import com.ameqran.serenica.domain.enumtype.BookingStatus;
import com.ameqran.serenica.domain.enumtype.NoteFormat;
import com.ameqran.serenica.domain.enumtype.RiskLevel;
import com.ameqran.serenica.domain.model.Booking;
import com.ameqran.serenica.domain.model.ManualNote;
import com.ameqran.serenica.domain.model.Patient;
import com.ameqran.serenica.domain.model.Session;
import com.ameqran.serenica.domain.repository.BookingRepository;
import com.ameqran.serenica.domain.repository.ManualNoteRepository;
import com.ameqran.serenica.domain.repository.PatientRepository;
import com.ameqran.serenica.domain.repository.SessionRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SeedDataConfig {

    @Bean
    CommandLineRunner seedData(
            PatientRepository patientRepository,
            BookingRepository bookingRepository,
            SessionRepository sessionRepository,
            ManualNoteRepository manualNoteRepository
    ) {
        return args -> {
            if (patientRepository.count() > 0) {
                return;
            }

            Patient sarah = patientRepository.save(Patient.builder()
                    .code("C-0041")
                    .firstName("Sarah")
                    .lastName("Mitchell")
                    .email("sarah.mitchell@example.com")
                    .phone("+1-555-200-3001")
                    .primaryConcern("Anxiety")
                    .therapyApproach("CBT")
                    .riskLevel(RiskLevel.LOW)
                    .active(true)
                    .build());

            Patient james = patientRepository.save(Patient.builder()
                    .code("C-0038")
                    .firstName("James")
                    .lastName("Thornton")
                    .email("james.thornton@example.com")
                    .phone("+1-555-200-3002")
                    .primaryConcern("PTSD")
                    .therapyApproach("Trauma-focused CBT")
                    .riskLevel(RiskLevel.MEDIUM)
                    .active(true)
                    .build());

            Patient amelia = patientRepository.save(Patient.builder()
                    .code("C-0044")
                    .firstName("Amelia")
                    .lastName("Ross")
                    .email("amelia.ross@example.com")
                    .phone("+1-555-200-3003")
                    .primaryConcern("Anxiety + Depression")
                    .therapyApproach("CBT")
                    .riskLevel(RiskLevel.LOW)
                    .active(true)
                    .build());

            Patient marcus = patientRepository.save(Patient.builder()
                    .code("C-0029")
                    .firstName("Marcus")
                    .lastName("Klein")
                    .email("marcus.klein@example.com")
                    .phone("+1-555-200-3004")
                    .primaryConcern("Depression")
                    .therapyApproach("DBT")
                    .riskLevel(RiskLevel.WATCH)
                    .active(true)
                    .build());

            Patient laura = patientRepository.save(Patient.builder()
                    .code("C-0047")
                    .firstName("Laura")
                    .lastName("Svensson")
                    .email("laura.svensson@example.com")
                    .phone("+1-555-200-3005")
                    .primaryConcern("PTSD")
                    .therapyApproach("EMDR")
                    .riskLevel(RiskLevel.HIGH)
                    .active(true)
                    .build());

            Patient patricia = patientRepository.save(Patient.builder()
                    .code("C-0035")
                    .firstName("Patricia")
                    .lastName("Wu")
                    .email("patricia.wu@example.com")
                    .phone("+1-555-200-3006")
                    .primaryConcern("Grief")
                    .therapyApproach("ACT")
                    .riskLevel(RiskLevel.LOW)
                    .active(true)
                    .build());

            LocalDate today = LocalDate.now();
            List<Booking> bookings = List.of(
                    bookingRepository.save(Booking.builder().patient(sarah).startsAt(LocalDateTime.of(today, LocalTime.of(9, 0))).durationMinutes(50).sessionType("CBT").status(BookingStatus.SCHEDULED).location("Room A").build()),
                    bookingRepository.save(Booking.builder().patient(james).startsAt(LocalDateTime.of(today, LocalTime.of(11, 0))).durationMinutes(50).sessionType("Trauma-focused").status(BookingStatus.SCHEDULED).location("Room B").build()),
                    bookingRepository.save(Booking.builder().patient(amelia).startsAt(LocalDateTime.of(today, LocalTime.of(14, 0))).durationMinutes(50).sessionType("Anxiety + Depression").status(BookingStatus.SCHEDULED).location("Room A").build()),
                    bookingRepository.save(Booking.builder().patient(marcus).startsAt(LocalDateTime.of(today, LocalTime.of(15, 30))).durationMinutes(50).sessionType("DBT").status(BookingStatus.SCHEDULED).location("Room C").build()),
                    bookingRepository.save(Booking.builder().patient(laura).startsAt(LocalDateTime.of(today, LocalTime.of(17, 0))).durationMinutes(50).sessionType("EMDR").status(BookingStatus.SCHEDULED).location("Room B").build()),
                    bookingRepository.save(Booking.builder().patient(patricia).startsAt(LocalDateTime.of(today.plusDays(2), LocalTime.of(10, 0))).durationMinutes(50).sessionType("ACT").status(BookingStatus.SCHEDULED).location("Telehealth").build())
            );

            Session s1 = sessionRepository.save(Session.builder()
                    .patient(sarah)
                    .booking(bookings.get(0))
                    .sessionNumber(12)
                    .occurredAt(LocalDateTime.of(today, LocalTime.of(9, 0)))
                    .durationMinutes(50)
                    .focusArea("Thought record & behavioral activation")
                    .phq9Score(8)
                    .gad7Score(6)
                    .moodScore(7)
                    .riskSummary("No current risk")
                    .summary("Client engaged with thought challenging and identified key distortions around work performance.")
                    .build());

            Session s2 = sessionRepository.save(Session.builder()
                    .patient(james)
                    .booking(bookings.get(1))
                    .sessionNumber(7)
                    .occurredAt(LocalDateTime.of(today.minusDays(1), LocalTime.of(11, 0)))
                    .durationMinutes(50)
                    .focusArea("Trauma narrative processing")
                    .phq9Score(12)
                    .gad7Score(8)
                    .moodScore(6)
                    .riskSummary("No acute risk")
                    .summary("Avoidance of public transit remained present; introduced graded exposure planning.")
                    .build());

            Session s3 = sessionRepository.save(Session.builder()
                    .patient(marcus)
                    .booking(bookings.get(3))
                    .sessionNumber(18)
                    .occurredAt(LocalDateTime.of(today.minusDays(1), LocalTime.of(15, 0)))
                    .durationMinutes(50)
                    .focusArea("DBT distress tolerance")
                    .phq9Score(14)
                    .gad7Score(9)
                    .moodScore(5)
                    .riskSummary("Passive ideation, no intent")
                    .summary("Reviewed TIPP usage and reinforced distress tolerance plan.")
                    .build());

            manualNoteRepository.saveAll(List.of(
                    ManualNote.builder().patient(sarah).session(s1).title("Session 12 — Thought Record & Behavioral Activation").format(NoteFormat.SOAP).signed(true).aiDrafted(false).content("Strong engagement with thought challenging. PHQ-9: 8 (mild). Homework assigned.").build(),
                    ManualNote.builder().patient(james).session(s2).title("Session 7 — Trauma Narrative Processing").format(NoteFormat.DAP).signed(false).aiDrafted(false).content("Data: moderate distress and avoidance. Assessment: within therapeutic window. Plan: graded exposure hierarchy.").build(),
                    ManualNote.builder().patient(marcus).session(s3).title("Session 18 — DBT Distress Tolerance Review").format(NoteFormat.SOAP).signed(false).aiDrafted(false).content("PHQ-9 increased from previous session. Safety assessment completed, no active ideation.").build(),
                    ManualNote.builder().patient(amelia).title("Session 3 — Psychoeducation & SMART Goal Setting").format(NoteFormat.FREE).signed(true).aiDrafted(false).content("Reviewed anxiety-depression comorbidity and established SMART goals.").build()
            ));
        };
    }
}
