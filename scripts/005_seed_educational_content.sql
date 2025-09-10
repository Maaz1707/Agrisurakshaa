-- Insert educational content categories
INSERT INTO educational_categories (name, description, icon, color) VALUES
('biosecurity', 'Biosecurity Fundamentals', '🛡️', 'primary'),
('disease-prevention', 'Disease Prevention', '🏥', 'secondary'),
('nutrition', 'Animal Nutrition', '🌾', 'accent'),
('management', 'Farm Management', '🚜', 'chart-4');

-- Insert sample courses
INSERT INTO courses (title, description, category_id, duration_minutes, difficulty_level, instructor_name, thumbnail_url, created_at) VALUES
('Introduction to Biosecurity', 'Learn the fundamental principles of farm biosecurity to protect your livestock from diseases', 
 (SELECT id FROM educational_categories WHERE name = 'biosecurity'), 45, 'beginner', 'Dr. Sarah Johnson', 
 '/placeholder.svg?height=300&width=500', NOW()),

('Visitor Management Protocols', 'Establish effective visitor control systems for your farm', 
 (SELECT id FROM educational_categories WHERE name = 'biosecurity'), 30, 'intermediate', 'Dr. Michael Chen', 
 '/placeholder.svg?height=300&width=500', NOW()),

('Equipment Sanitization', 'Proper cleaning and disinfection procedures for farm equipment', 
 (SELECT id FROM educational_categories WHERE name = 'biosecurity'), 35, 'beginner', 'Dr. Sarah Johnson', 
 '/placeholder.svg?height=300&width=500', NOW()),

('Poultry Disease Recognition', 'Identify common diseases in poultry and take preventive measures', 
 (SELECT id FROM educational_categories WHERE name = 'disease-prevention'), 40, 'intermediate', 'Dr. Lisa Wang', 
 '/placeholder.svg?height=300&width=500', NOW()),

('Feed Quality Assessment', 'Learn to evaluate and maintain optimal feed quality for livestock', 
 (SELECT id FROM educational_categories WHERE name = 'nutrition'), 25, 'beginner', 'Prof. James Miller', 
 '/placeholder.svg?height=300&width=500', NOW());

-- Insert course lessons
INSERT INTO course_lessons (course_id, title, description, duration_minutes, lesson_order, lesson_type, video_url) VALUES
-- Biosecurity course lessons
((SELECT id FROM courses WHERE title = 'Introduction to Biosecurity'), 'What is Biosecurity?', 'Understanding the basic concepts of farm biosecurity', 8, 1, 'video', '/placeholder-video.mp4'),
((SELECT id FROM courses WHERE title = 'Introduction to Biosecurity'), 'Risk Assessment Basics', 'Learn to identify and assess biosecurity risks', 12, 2, 'video', '/placeholder-video.mp4'),
((SELECT id FROM courses WHERE title = 'Introduction to Biosecurity'), 'Entry Point Controls', 'Controlling access points to your farm', 10, 3, 'video', '/placeholder-video.mp4'),
((SELECT id FROM courses WHERE title = 'Introduction to Biosecurity'), 'Vehicle Sanitization', 'Proper vehicle cleaning and disinfection', 15, 4, 'video', '/placeholder-video.mp4'),
((SELECT id FROM courses WHERE title = 'Introduction to Biosecurity'), 'Personal Protective Equipment', 'Using PPE effectively on the farm', 8, 5, 'video', '/placeholder-video.mp4'),
((SELECT id FROM courses WHERE title = 'Introduction to Biosecurity'), 'Knowledge Check Quiz', 'Test your understanding of biosecurity basics', 10, 6, 'quiz', NULL),
((SELECT id FROM courses WHERE title = 'Introduction to Biosecurity'), 'Case Study: Disease Outbreak', 'Real-world example of biosecurity failure', 12, 7, 'reading', NULL),
((SELECT id FROM courses WHERE title = 'Introduction to Biosecurity'), 'Final Assessment', 'Comprehensive test of course material', 15, 8, 'quiz', NULL);

-- Insert sample quiz questions
INSERT INTO quiz_questions (lesson_id, question_text, question_type, correct_answer, options) VALUES
((SELECT id FROM course_lessons WHERE title = 'Knowledge Check Quiz'), 
 'What is the primary goal of farm biosecurity?', 'multiple_choice', 'Prevent disease introduction and spread',
 '["Increase productivity", "Prevent disease introduction and spread", "Reduce costs", "Improve animal welfare"]'),

((SELECT id FROM course_lessons WHERE title = 'Knowledge Check Quiz'), 
 'Visitors should always follow biosecurity protocols when entering the farm.', 'true_false', 'true',
 '["true", "false"]'),

((SELECT id FROM course_lessons WHERE title = 'Final Assessment'), 
 'Which of the following is NOT a key component of biosecurity?', 'multiple_choice', 'Maximizing animal density',
 '["Controlling access", "Sanitization protocols", "Maximizing animal density", "Health monitoring"]');

-- Insert user progress (sample data)
INSERT INTO user_course_progress (user_id, course_id, progress_percentage, completed_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM courses WHERE title = 'Introduction to Biosecurity'), 25, NULL),
('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM courses WHERE title = 'Visitor Management Protocols'), 100, NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM courses WHERE title = 'Feed Quality Assessment'), 60, NULL);

-- Insert lesson completions
INSERT INTO user_lesson_progress (user_id, lesson_id, completed_at, quiz_score) VALUES
('550e8400-e29b-41d4-a716-446655440000', 
 (SELECT id FROM course_lessons WHERE title = 'What is Biosecurity?' AND course_id = (SELECT id FROM courses WHERE title = 'Introduction to Biosecurity')), 
 NOW() - INTERVAL '1 day', NULL),
('550e8400-e29b-41d4-a716-446655440000', 
 (SELECT id FROM course_lessons WHERE title = 'Risk Assessment Basics' AND course_id = (SELECT id FROM courses WHERE title = 'Introduction to Biosecurity')), 
 NOW() - INTERVAL '1 day', NULL);

-- Insert achievements
INSERT INTO user_achievements (user_id, achievement_type, achievement_name, description, earned_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'course_completion', 'Biosecurity Expert', 'Completed all biosecurity courses', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440000', 'quiz_mastery', 'Disease Detective', 'Passed 10 disease identification quizzes', NOW() - INTERVAL '5 days');
