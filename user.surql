DEFINE ACCESS public
    ON DATABASE
    TYPE RECORD
    SIGNUP (
        RETURN {
        }
    )
    SIGNIN (
        RETURN {
        }
    )
    WITH JWT
        ALGORITHM HS512
        KEY '[REDACTED]'
        WITH ISSUER
            KEY '[REDACTED]'
        DURATION
            FOR TOKEN   1h,
            FOR SESSION 1h;


DEFINE ACCESS user
    ON DATABASE
    TYPE RECORD
    SIGNUP (
        CREATE users SET
            username = $username,
            password = crypto::argon2::generate($password)
    )
    SIGNIN (
        SELECT * FROM users
        WHERE username = $username
        AND crypto::argon2::compare(password, $password)
    )
    WITH REFRESH
    WITH JWT
        DURATION
            FOR GRANT   4w2d,
            FOR TOKEN   1h,
            FOR SESSION 12h;
