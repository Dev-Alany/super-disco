CREATE TABLE queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id UUID, -- Optional for future user authentication
    CONSTRAINT question_not_empty CHECK (question <> '')
);