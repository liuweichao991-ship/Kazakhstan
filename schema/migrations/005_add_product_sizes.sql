-- Migration: Add sizes column to products table
-- Date: 2026-06-27
-- Description: Add sizes column to store size options as JSON array

ALTER TABLE products ADD COLUMN sizes TEXT DEFAULT '[]';
