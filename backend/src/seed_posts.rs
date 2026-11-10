//! The ten posts from the old static blog. Inserted once, keyed by slug, so a restart does not duplicate them.
//! Writing after this happens in `/admin`.

use sqlx::SqlitePool;

const RAW: &[(&str, &str)] = &[
    ("ai-safety-should-focus-on-the-harnesses-over-weights", include_str!("../../content/posts/AI_Safety_Should_Focus_on_the_Harnesses_Over_Weights.md")),
    ("cathedrals-of-infinite-scroll", include_str!("../../content/posts/Cathedrals_of_Infinite_Scroll.md")),
    ("constitutions-sans-courts", include_str!("../../content/posts/Constitutions_Sans_Courts.md")),
    ("freedom-of-the-intellect", include_str!("../../content/posts/Freedom_of_the_Intellect.md")),
    ("on-courage", include_str!("../../content/posts/On_Courage.md")),
    ("on-totalitariansim", include_str!("../../content/posts/On_Totalitariansim.md")),
    ("propaganda-themed-socks", include_str!("../../content/posts/Propaganda_Themed_Socks.md")),
    ("responding-in-ideology", include_str!("../../content/posts/Responding_in_Ideology.md")),
    ("the-perversion-of-sisyphus", include_str!("../../content/posts/The_Perversion_of_Sisyphus.md")),
    ("thoughtforms-on-philosophy-of-propaganda", include_str!("../../content/posts/Thoughtforms_on_Philosophy_of_Propaganda.md")),
];

struct SeedPost {
    slug: &'static str,
    title: String,
    date: String,
    body: String,
    excerpt: String,
}

fn parse(slug: &'static str, raw: &str) -> SeedPost {
    let rest = raw.strip_prefix("---").unwrap_or(raw);
    let (fm, body) = rest.split_once("\n---").unwrap_or(("", rest));
    let mut title = String::new();
    let mut date = String::new();
    for line in fm.lines() {
        if let Some(v) = line.strip_prefix("title:") {
            title = v.trim().trim_matches('"').to_string();
        } else if let Some(v) = line.strip_prefix("date:") {
            date = v.trim().to_string();
        }
    }
    let body = body.trim().to_string();
    let excerpt = body
        .split("\n\n")
        .find(|p| !p.trim().is_empty())
        .unwrap_or("")
        .chars()
        .take(240)
        .collect();
    SeedPost { slug, title, date, body, excerpt }
}

fn posts() -> Vec<SeedPost> {
    RAW.iter().map(|(slug, raw)| parse(slug, raw)).collect()
}

pub async fn seed(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    for post in posts() {
        let created = format!("{} 12:00:00", post.date);
        sqlx::query(
            "INSERT OR IGNORE INTO posts \
             (title, content, excerpt, status, author, created_at, updated_at, source_language, format, slug, title_en, content_en, excerpt_en) \
             VALUES (?, ?, ?, 'published', 'Isaac Jennings', ?, ?, 'en', 'markdown', ?, ?, ?, ?)",
        )
        .bind(&post.title)
        .bind(&post.body)
        .bind(&post.excerpt)
        .bind(&created)
        .bind(&created)
        .bind(post.slug)
        .bind(&post.title)
        .bind(&post.body)
        .bind(&post.excerpt)
        .execute(pool)
        .await?;
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ten_posts_keep_titles_dates_and_the_filename_typo() {
        let posts = posts();
        assert_eq!(posts.len(), 10);
        assert!(posts.iter().all(|p| !p.title.is_empty() && p.date.len() == 10 && !p.body.is_empty()));
        assert!(posts.iter().any(|p| p.slug == "on-totalitariansim" && p.title == "On Totalitariansim"));
    }
}
