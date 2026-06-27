-- Migration: Add colors column to products table
-- Date: 2026-06-27
-- Description: Add colors column to store color options as JSON array

ALTER TABLE products ADD COLUMN colors TEXT DEFAULT '[]';
