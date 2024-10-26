'use server'

import { db } from '@vercel/postgres';
const client = await db.connect();

import { Post, Encuesta,  Question, Response, Answer , SocialAccount } from "./types";

export async function load_posts(offset: number, limit: number, redSocial: string, tipoPublicacion: string, estado: string): Promise<Post[]> {
    let sqlQuery = `
    SELECT * FROM posts 
    WHERE id IS NOT NULL
    `;
    
    const params: any[] = [];
    
    if (redSocial !== 'all') {
        sqlQuery += ` AND social_media = $${params.length + 1}`;
        params.push(redSocial);
    }
    
    if (tipoPublicacion !== 'all') {
        sqlQuery += ` AND type = $${params.length + 1}`;
        params.push(tipoPublicacion);
    }
    
    if (estado !== 'all') {
        sqlQuery += ` AND status = $${params.length + 1}`;
        params.push(estado);
    }
    
    sqlQuery += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    console.log(sqlQuery);
    console.log(params);

    const result = await client.query(sqlQuery, params);
    
    return result.rows as Post[];
}

export async function load_post_by_id(postId: string): Promise<Post> {
    const result = await client.sql`
        SELECT * FROM posts WHERE id = ${postId}
    `;
    if (result.rows.length === 0) {
        throw new Error(`Post with id ${postId} not found`);
    }
    return result.rows[0] as Post;
}

export async function create_post(newPost: Post): Promise<Post> {
    const result = await client.sql`
        INSERT INTO posts (social_media, type, status, preview, media, content, post_time, link, is_programmed, programmed_post_time)
        VALUES (${newPost.social_media}, ${newPost.type}, ${newPost.status}, ${newPost.preview}, ${newPost.media}, ${newPost.content}, ${newPost.post_time}, ${newPost.link}, ${newPost.is_programmed}, ${newPost.programmed_post_time})
        RETURNING *
    `;
    return result.rows[0] as Post;
}

export async function load_programmed_posts(): Promise<Post[]> {
    const result = await client.sql`
        SELECT * FROM posts WHERE is_programmed = true
    `;
    return result.rows as Post[];
}

export async function load_all_survey(offset: number, limit: number, estado: string): Promise<Encuesta[]> {
    let sqlQuery = `
    SELECT * FROM encuestas 
    WHERE id IS NOT NULL
    `;
    
    const params: any[] = [];
    
    if (estado !== 'all') {
        sqlQuery += ` AND status = $${params.length + 1}`;
        params.push(estado);
    }
    
    sqlQuery += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    console.log(sqlQuery);
    console.log(params);

    const encuestasResult = await client.query(sqlQuery, params);
    const encuestas = encuestasResult.rows as Encuesta[];

    for (const encuesta of encuestas) {
        encuesta.questions = await load_questions_by_encuesta_id(encuesta.id);
        encuesta.responses = await load_responses_by_encuesta_id(encuesta.id);
    }

    return encuestas;
}

export async function load_survey_by_id(surveyId: string): Promise<Encuesta> {
    const encuestaResult = await client.sql`
        SELECT * FROM encuestas WHERE id = ${surveyId}
    `;
    if (encuestaResult.rows.length === 0) {
        throw new Error(`Survey with id ${surveyId} not found`);
    }
    const encuesta = encuestaResult.rows[0] as Encuesta;
    encuesta.questions = await load_questions_by_encuesta_id(encuesta.id);
    encuesta.responses = await load_responses_by_encuesta_id(encuesta.id);

    return encuesta;
}

export async function check_survey_response(surveyId: string, userIP: string): Promise<boolean> {
    const responsesResult = await client.sql`
        SELECT * FROM responses WHERE encuesta_id = ${surveyId} AND ip = ${userIP}
    `;
    return responsesResult.rows.length > 0;
}

export async function upload_survey(newSurvey: Encuesta): Promise<Encuesta> {
    const encuestaResult = await client.sql`
        INSERT INTO encuestas (title, description, status, start_date, end_date)
        VALUES (${newSurvey.title}, ${newSurvey.description}, ${newSurvey.status}, ${newSurvey.start_date}, ${newSurvey.end_date})
        RETURNING *
    `;
    const encuesta = encuestaResult.rows[0] as Encuesta;

    for (const question of newSurvey.questions || []) {
        await client.sql`
            INSERT INTO questions (encuesta_id, title, type, required, options)
            VALUES (${encuesta.id}, ${question.title}, ${question.type}, ${question.required}, ARRAY[${question.options?.map(option => `'${option}'`).join(', ')}])
        `;
    }

    return encuesta;
}
async function load_questions_by_encuesta_id(encuestaId: string): Promise<Question[]> {
    const questionsResult = await client.sql`
        SELECT id, encuesta_id, title, type, required, options FROM questions WHERE encuesta_id = ${encuestaId}
    `;

    return questionsResult.rows.map(row => ({
        ...row,
        options: row.options && row.options[0] ? row.options[0].split(',').map((option: string) => option.trim().replace(/^'|'$/g, '')) : null
    })) as Question[];
}


async function load_responses_by_encuesta_id(encuestaId: string): Promise<Response[]> {
    const responsesResult = await client.sql`
        SELECT * FROM responses WHERE encuesta_id = ${encuestaId}
    `;
    const responses = responsesResult.rows as Response[];

    for (const response of responses) {
        response.answers = await load_answers_by_response_id(response.id);
    }

    return responses;
}

async function load_answers_by_response_id(responseId: string): Promise<Answer[]> {
    const answersResult = await client.sql`
        SELECT * FROM answers WHERE response_id = ${responseId}
    `;
    return answersResult.rows as Answer[];
}


export async function submit_survey_response(surveyId: string, responseQ: Response): Promise<void> {
    // Insert the response into the responses table
    const responseResult = await client.sql`
        INSERT INTO responses (encuesta_id, date, ip)
        VALUES (${surveyId}, ${responseQ.date}, ${responseQ.ip})
        RETURNING id
    `;
    const responseId = responseResult.rows[0].id;

    // Insert each answer into the answers table
    for (const answer of responseQ.answers) {
        await client.sql`
            INSERT INTO answers (response_id, question_id, answer)
            VALUES (${responseId}, ${answer.question_id}, ${answer.answer})
        `;
    }
}

export async function load_all_social_accounts(): Promise<SocialAccount[]> {
    const result = await client.sql`
        SELECT * FROM social_accounts
    `;
    return result.rows as SocialAccount[];
}

export async function add_social_account(social_account: SocialAccount): Promise<void> {
    await client.sql`
        INSERT INTO social_accounts (red_social, usuario, tipo_autenticacion, page_id, open_id, refresh_token, token_autenticacion, instagram_business_account, fecha_expiracion_token, fecha_expiracion_refresh, linked)
        VALUES (${social_account.red_social}, ${social_account.usuario}, ${social_account.tipo_autenticacion}, ${social_account.page_id}, ${social_account.open_id}, ${social_account.refresh_token}, ${social_account.token_autenticacion}, ${social_account.instagram_business_account}, ${social_account.fecha_expiracion_token}, ${social_account.fecha_expiracion_refresh}, ${social_account.linked})
    `;
}

export async function logout_social_account(red_social: string): Promise<void> {
    await client.sql`
        DELETE FROM social_accounts WHERE red_social = ${red_social}
    `;
}