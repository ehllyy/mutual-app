package com.amalitech.skillshare.controller;

import com.amalitech.skillshare.model.Skill;
import com.amalitech.skillshare.repository.SkillRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/skills")
@CrossOrigin
public class SkillController {

    private final SkillRepository skillRepository;

    public SkillController(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @PostMapping
    public Skill createSkill(@RequestBody Skill skill) {
        return skillRepository.save(skill);
    }

    @GetMapping
    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    @GetMapping("/category/{category}")
    public List<Skill> getSkillsByCategory(
            @PathVariable String category
    ) {
        return skillRepository.findByCategory(category);
    }

    @GetMapping("/location/{location}")
    public List<Skill> getSkillsByLocation(
            @PathVariable String location
    ) {
        return skillRepository.findByLocation(location);
    }
}
