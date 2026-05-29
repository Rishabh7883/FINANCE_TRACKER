package com.tracker.controller;

import com.tracker.dto.ApiResponse;
import com.tracker.dto.CategoryDto;
import com.tracker.dto.CategoryRequest;
import com.tracker.security.UserPrincipal;
import com.tracker.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getCategories(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<CategoryDto> categories = categoryService.getCategoriesForUser(userPrincipal);
        return ResponseEntity.ok(categories);
    }

    @PostMapping
    public ResponseEntity<?> createCategory(
            @Valid @RequestBody CategoryRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            CategoryDto categoryDto = categoryService.createCategory(request, userPrincipal);
            return ResponseEntity.status(HttpStatus.CREATED).body(categoryDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage()));
        }
    }
}
