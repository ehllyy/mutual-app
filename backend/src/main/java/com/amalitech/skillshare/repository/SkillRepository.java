package com.amalitech.skillshare.repository;

import com.amalitech.skillshare.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findByCategory(String category);

    List<Skill> findByLocation(String location);
}