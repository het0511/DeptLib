package com.library.service;

import com.library.dto.UserDto;
import com.library.model.User;
import com.library.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public boolean deleteUserById(String id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getRole() == User.Role.ADMIN) {
                return false; // cannot delete admins
            }
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public User updateUserRole(String userId, String newRoleStr) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        User.Role newRole;
        try {
            newRole = User.Role.valueOf(newRoleStr.toUpperCase());  // Convert String to enum
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + newRoleStr);
        }

        if (user.getRole() == User.Role.ADMIN && newRole != User.Role.ADMIN) {
            throw new IllegalArgumentException("Cannot demote an admin to a lower role.");
        }

        if (user.getRole() != User.Role.ADMIN && newRole == User.Role.ADMIN) {
            user.setRole(newRole);
            userRepository.save(user);
            return user;
        }

        if (user.getRole() == newRole) {
            return user; // No change
        }

        throw new IllegalArgumentException("Invalid role update.");
    }

    private UserDto mapToDto(User user) {
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()  // convert enum to String
        );
    }
}
