package com.tracker.config;

import com.tracker.model.Category;
import com.tracker.model.TransactionType;
import com.tracker.repository.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        logger.info("DatabaseSeeder starting check for default categories...");
        seedDefaultCategories();
    }

    private void seedDefaultCategories() {
        // Default Income Categories
        List<String> defaultIncomeCategories = Arrays.asList("Salary", "Freelancing", "Business", "Investment");
        for (String catName : defaultIncomeCategories) {
            if (!categoryRepository.existsByNameAndTypeAndUserIsNull(catName, TransactionType.INCOME)) {
                categoryRepository.save(new Category(catName, TransactionType.INCOME, null));
                logger.info("Seeded default INCOME category: {}", catName);
            }
        }

        // Default Expense Categories
        List<String> defaultExpenseCategories = Arrays.asList(
            "Food", "Transport", "Shopping", "Entertainment", "Education", "Health", "Bills", "Miscellaneous"
        );
        for (String catName : defaultExpenseCategories) {
            if (!categoryRepository.existsByNameAndTypeAndUserIsNull(catName, TransactionType.EXPENSE)) {
                categoryRepository.save(new Category(catName, TransactionType.EXPENSE, null));
                logger.info("Seeded default EXPENSE category: {}", catName);
            }
        }
        logger.info("DatabaseSeeder completed category checks.");
    }
}
