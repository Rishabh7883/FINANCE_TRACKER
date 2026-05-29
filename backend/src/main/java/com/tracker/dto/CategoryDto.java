package com.tracker.dto;

import com.tracker.model.TransactionType;

public class CategoryDto {
    private Long id;
    private String name;
    private TransactionType type;
    private boolean isSystem;

    public CategoryDto(Long id, String name, TransactionType type, boolean isSystem) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.isSystem = isSystem;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public boolean isSystem() {
        return isSystem;
    }

    public void setSystem(boolean isSystem) {
        this.isSystem = isSystem;
    }
}
