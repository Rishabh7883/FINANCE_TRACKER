package com.tracker.service;

import com.tracker.dto.CategoryDto;
import com.tracker.dto.CategoryRequest;
import com.tracker.model.Category;
import com.tracker.model.User;
import com.tracker.repository.CategoryRepository;
import com.tracker.repository.UserRepository;
import com.tracker.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<CategoryDto> getCategoriesForUser(UserPrincipal currentUser) {
        List<Category> categories = categoryRepository.findAllByUserIdOrSystem(currentUser.getId());
        return categories.stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public CategoryDto createCategory(CategoryRequest request, UserPrincipal currentUser) {
        // Trim name for clean storage
        String name = request.getName().trim();

        // Check if category already exists as a global category or user custom category
        if (categoryRepository.existsByNameAndTypeAndUserIdOrSystem(name, request.getType(), currentUser.getId())) {
            throw new IllegalArgumentException("Category with name '" + name + "' and type '" + request.getType() + "' already exists.");
        }

        User user = userRepository.findById(currentUser.getId())
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Category category = new Category(name, request.getType(), user);
        Category savedCategory = categoryRepository.save(category);

        return mapToDto(savedCategory);
    }

    public CategoryDto mapToDto(Category category) {
        return new CategoryDto(
            category.getId(),
            category.getName(),
            category.getType(),
            category.getUser() == null
        );
    }
}
