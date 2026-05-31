package com.amalitech.skillshare.controller;

import com.amalitech.skillshare.model.User;
import com.amalitech.skillshare.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {

        Optional<User> existingUser =
                userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {

            User foundUser = existingUser.get();

            if (foundUser.getPassword()
                    .equals(user.getPassword())) {
                return "Login Successful";
            }
        }

        return "Invalid Email or Password";
    }
}
