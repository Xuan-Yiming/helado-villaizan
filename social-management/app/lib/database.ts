"use server";

import { db } from "@vercel/postgres";
import { VercelPoolClient } from "@vercel/postgres";
import {
  Post,
  Encuesta,
  Question,
  Response,
  Answer,
  SocialAccount,
  UserAccount,
  AuthenticatedUser
} from "./types";
import jwt from "jsonwebtoken";

// const client = await db.connect();

let client: VercelPoolClient | null = null;

async function connectToDatabase() {
  if (!client) {
    try {
      client = await db.connect();
      //console.log("Database connected successfully");
    } catch (error) {
      console.error("Error connecting to the database:", error);
      throw new Error("Database connection failed");
    }
  }
}

// user account
export async function authenticate_user(
  username: string,
  password: string
): Promise<AuthenticatedUser> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }

  const result = await client.query(
    `SELECT id, username, role, active FROM user_accounts WHERE username = $1 AND password = $2 AND active = true`,
    [username, password]
  );

  if (result.rows.length > 0) {
    const user = result.rows[0];
    const auth = await generateToken(user.id);

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      token: auth.token,
      token_expiration: auth.expirationDate,
    };
  } else {
    throw new Error("User not found or inactive");
  }
}

export async function generateToken(
  userID: string
): Promise<{ token: string; expirationDate: Date }> {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 1); // Set expiration date to one day from now

  const secretKey = process.env.AUTH_SECRET;
  if (!secretKey) {
    throw new Error("JWT secret key is not defined in environment variables");
  }
  const token = jwt.sign({ userID }, secretKey, { expiresIn: "1d" });

  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }

    await client.query(
        'UPDATE user_accounts SET token = $1, token_expiration_date = $2 WHERE id = $3',
        [token, expirationDate.toISOString(), userID]
    );

        //console.log("Token updated in database");
  return { token, expirationDate };
}

export async function verifyToken(token: string): Promise<boolean> {
  const secretKey = process.env.AUTH_SECRET;
  if (!secretKey) {
    throw new Error("JWT secret key is not defined in environment variables");
  }

  try {
    jwt.verify(token, secretKey);
    return true;
  } catch (error) {
    return false;
  }
}

export async function activate_user(userId: string): Promise<void> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }
  await client.sql`
                UPDATE user_accounts SET active = true WHERE id = ${userId}
        `;
}

export async function deactivate_user(userId: string): Promise<void> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }
  await client.sql`
                UPDATE user_accounts SET active = false WHERE id = ${userId}
        `;
}

export async function delete_user(userId: string): Promise<void> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }

  // Delete user account
  await client.sql`
                DELETE FROM user_accounts WHERE id = ${userId}
        `;
}

export async function is_email_available(email: string, userID:string): Promise<void> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }
  const result = await client.sql`
    SELECT * FROM user_accounts WHERE username = ${email} AND id != ${userID}
  `;
  if (result.rows.length > 0) {
    throw new Error("Email repetido");
  }
}

// export async function verify_password(
//   userId: string,
//   inputPassword: string
// ): Promise<boolean> {
//   const user = await get_user_by_id(userId);
//   if (!user) {
//     throw new Error("User not found");
//   }

//   const isMatch = await bcrypt.compare(inputPassword, user.password);
//   return isMatch;
// }

export async function update_profile_photo(
  userId: string,
  photoURL: string
): Promise<void> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }

  await client.sql`
    UPDATE user_accounts SET photo = ${photoURL} WHERE id = ${userId}
  `;
}

export async function update_password(
  userId: string,
  newPassword: string
): Promise<void> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }

  await client.sql`
        UPDATE user_accounts SET password = ${newPassword} WHERE id = ${userId}
    `;
}

export async function createOrUpdateUserAccount(
  userAccount: UserAccount
): Promise<void> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }

  if (userAccount.id !== "") {
    const existingUser = await client.sql`
    SELECT id FROM user_accounts WHERE id = ${userAccount.id}
`;

    if (existingUser.rows.length > 0) {
      await client.sql`
        UPDATE user_accounts
        SET username = ${userAccount.username},
                password = ${userAccount.password},
                nombre = ${userAccount.nombre},
                apellido = ${userAccount.apellido},
                role = ${userAccount.role},
                photo = ${userAccount.photo}
        WHERE id = ${userAccount.id}
    `;
    } else {
      await client.sql`
        INSERT INTO user_accounts (username, password, nombre, apellido, role, active, photo)
        VALUES (${userAccount.username}, ${userAccount.password}, ${
        userAccount.nombre
      }, ${userAccount.apellido}, ${userAccount.role},${true}, ${
        userAccount.photo
      })
        `;
    }
  } else {
    await client.sql`
    INSERT INTO user_accounts (username, password, nombre, apellido, role, active, photo)
    VALUES (${userAccount.username}, ${userAccount.password}, ${
      userAccount.nombre
    }, ${userAccount.apellido}, ${userAccount.role},${true}, ${
      userAccount.photo
    })
`;
  }
}

export async function load_all_users(
  offset: number,
  limit: number,
  role: string,
  status: string
): Promise<UserAccount[]> {
  let sqlQuery = `
    SELECT * FROM user_accounts 
    WHERE id IS NOT NULL
    `;

  const params: any[] = [];

  if (role !== "all") {
    sqlQuery += ` AND role = $${params.length + 1}`;
    params.push(role);
  }

  if (status !== "all") {
    sqlQuery += ` AND active = $${params.length + 1}`;
    params.push(status === "active");
  }

  sqlQuery += `
    ORDER BY id ASC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  //console.log(sqlQuery);
  //console.log(params);

  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }

  const usersResult = await client.query(sqlQuery, params);
  return usersResult.rows as UserAccount[];
}

export async function get_user_by_id(
  userId: string
): Promise<UserAccount | null> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }

  const result = await client.sql`
        SELECT * FROM user_accounts WHERE id = ${userId}
    `;

  return result.rows.length > 0 ? (result.rows[0] as UserAccount) : null;
}

// Posts
export async function load_posts(
  offset: number,
  limit: number,
  redSocial: string,
  tipoPublicacion: string,
  estado: string
): Promise<Post[]> {
  let sqlQuery = `
    SELECT posts.*, array_agg(social_media.platform) as social_media
    FROM posts
    LEFT JOIN social_media ON posts.id = social_media.post_id
    WHERE posts.id IS NOT NULL
    `;

  const params: any[] = [];

  if (redSocial !== "all") {
    sqlQuery += ` AND social_media.platform = $${params.length + 1}`;
    params.push(redSocial);
  }

  if (tipoPublicacion !== "all") {
    sqlQuery += ` AND posts.type = $${params.length + 1}`;
    params.push(tipoPublicacion);
  }

  if (estado !== "all") {
    sqlQuery += ` AND posts.status = $${params.length + 1}`;
    params.push(estado);
  }
  sqlQuery += `
    GROUP BY posts.id
    ORDER BY posts.post_time DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
  params.push(limit, offset);

  //console.log(sqlQuery);
  //console.log(params);

  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }
  const result = await client.query(sqlQuery, params);

  return result.rows as Post[];
}

export async function load_post_by_id(postId: string): Promise<Post> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }

  // Query to get the post along with its social media platforms and media links
  const result = await client.sql`
        SELECT 
            posts.*, 
            array_agg(DISTINCT social_media.platform) AS social_media,
            array_agg(DISTINCT media.link) AS media
        FROM posts
        LEFT JOIN social_media ON posts.id = social_media.post_id
        LEFT JOIN media ON posts.id = media.post_id
        WHERE posts.id = ${postId}
        GROUP BY posts.id
    `;

  if (result.rows.length === 0) {
    throw new Error(`Post with id ${postId} not found`);
  }

  return result.rows[0] as Post;
}

export async function create_post(newPost: Post): Promise<Post> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }

  const {
    id,
    type,
    status,
    thumbnail,
    content,
    post_time,
    social_media,
    media,
  } = newPost;

  // Insert into posts table
  const postResult = await client.sql`
        INSERT INTO posts (type, status, thumbnail, content, post_time)
        VALUES (${type}, ${status}, ${thumbnail}, ${content}, ${post_time})
        RETURNING id;
    `;

  const postId = postResult.rows[0].id;

  // Insert into social_media table
  for (const platform of social_media) {
    await client.sql`
            INSERT INTO social_media (post_id, platform)
            VALUES (${postId}, ${platform});
        `;
  }

  // Insert into media table
  if (media) {
    for (const link of media) {
      await client.sql`
                INSERT INTO media (post_id, link)
                VALUES (${postId}, ${link});
            `;
    }
  }

  // Fetch the created post
  const result = await client.sql`
        SELECT * FROM posts WHERE id = ${postId};
    `;

  return result.rows[0] as Post;
}

export async function load_programmed_posts(): Promise<Post[]> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }

  // Query to get the programmed posts along with their social media platforms
  const result = await client.sql`
        SELECT 
            posts.*, 
            array_agg(social_media.platform) AS social_media
        FROM posts
        LEFT JOIN social_media ON posts.id = social_media.post_id
        WHERE posts.status = 'programado'
        GROUP BY posts.id
    `;

  return result.rows as Post[];
}

export async function delete_media_by_url(url: string): Promise<void> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }

  await client.sql`
        DELETE FROM media WHERE link = ${url}
    `;
}

export async function update_post_status(postId: string, status: string): Promise<void> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }

  await client.sql`
    UPDATE posts SET status = ${status} WHERE id = ${postId}
  `;
}

// ENCUESTAS
export async function load_all_survey(
  offset: number,
  limit: number,
  estado: string,
  isQuestion: boolean,
  isResponse: boolean
): Promise<Encuesta[]> {
  let sqlQuery = `
    SELECT * FROM encuestas 
    WHERE id IS NOT NULL
    `;

  const params: any[] = [];

  if (estado !== "all") {
    sqlQuery += ` AND status = $${params.length + 1}`;
    params.push(estado);
  }

  sqlQuery += `
    ORDER BY end_date DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  //console.log(sqlQuery);
  //console.log(params);

  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }

  const encuestasResult = await client.query(sqlQuery, params);
  const encuestas = encuestasResult.rows as Encuesta[];

  if (isQuestion) {
    for (const encuesta of encuestas) {
      encuesta.questions = await load_questions_by_encuesta_id(encuesta.id);
    }
  }

  if (isResponse) {
    for (const encuesta of encuestas) {
      encuesta.responses = await load_responses_by_encuesta_id(encuesta.id);
    }
  }

  return encuestas;
}

export async function load_survey_by_id(
  surveyId: string,
  isResponse: boolean
): Promise<Encuesta> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }

  const encuestaResult = await client.sql`
        SELECT * FROM encuestas WHERE id = ${surveyId}
    `;
  if (encuestaResult.rows.length === 0) {
    throw new Error(`Survey with id ${surveyId} not found`);
  }
  const encuesta = encuestaResult.rows[0] as Encuesta;
  encuesta.questions = await load_questions_by_encuesta_id(encuesta.id);
  if (isResponse)
    encuesta.responses = await load_responses_by_encuesta_id(encuesta.id);

  return encuesta;
}

export async function check_survey_response(
  surveyId: string,
  userIP: string
): Promise<boolean> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }

  //console.log("Checking survey response:", surveyId, userIP);
  const responsesResult = await client.sql`
        SELECT * FROM responses WHERE encuesta_id = ${surveyId} AND ip = ${userIP}
    `;
  return responsesResult.rows.length > 0;
}

export async function upload_survey(newSurvey: Encuesta): Promise<Encuesta> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }

  // Verifica si `creator_id` está presente
  if (!newSurvey.creator_id) {
    throw new Error("El campo creator_id es obligatorio para crear una encuesta");
  }

  // Inserta la encuesta con el campo creator_id
  const encuestaResult = await client.sql`
        INSERT INTO encuestas (title, description, status, start_date, end_date, creator_id)
        VALUES (${newSurvey.title}, ${newSurvey.description}, ${newSurvey.status}, ${newSurvey.start_date}, ${newSurvey.end_date}, ${newSurvey.creator_id})
        RETURNING *
    `;
  const encuesta = encuestaResult.rows[0] as Encuesta;

  // Inserta las preguntas asociadas a la encuesta
  for (const question of newSurvey.questions || []) {
    await client.sql`
            INSERT INTO questions (encuesta_id, title, type, required, options)
            VALUES (${encuesta.id}, ${question.title}, ${question.type}, ${
      question.required
    }, ARRAY[${question.options?.map((option) => `'${option}'`).join(", ")}])
        `;
  }

  return encuesta;
}

async function load_questions_by_encuesta_id(
  encuestaId: string
): Promise<Question[]> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }
  const questionsResult = await client.sql`
        SELECT id, encuesta_id, title, type, required, options FROM questions WHERE encuesta_id = ${encuestaId}
    `;

  return questionsResult.rows.map((row) => ({
    ...row,
    options:
      row.options && row.options[0]
        ? row.options[0]
            .split(",")
            .map((option: string) => option.trim().replace(/^'|'$/g, ""))
        : null,
  })) as Question[];
}

export async function load_responses_by_encuesta_id(
  encuestaId: string
): Promise<Response[]> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }

  const responsesResult = await client.sql`
        SELECT * FROM responses WHERE encuesta_id = ${encuestaId}
    `;
  const responses = responsesResult.rows as Response[];

  for (const response of responses) {
    response.answers = await load_answers_by_response_id(response.id);
  }

  return responses;
}

async function load_answers_by_response_id(
  responseId: string
): Promise<Answer[]> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }

  const answersResult = await client.sql`
        SELECT * FROM answers WHERE response_id = ${responseId}
    `;
  return answersResult.rows as Answer[];
}

export async function submit_survey_response(
  surveyId: string,
  responseQ: Response
): Promise<void> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }

  // Insert the response into the responses table
  const responseResult = await client.sql`
        INSERT INTO responses (encuesta_id, date, ip)
        VALUES (${surveyId}, ${responseQ.date}, ${responseQ.ip})
        RETURNING id
    `;
  const responseId = responseResult.rows[0].id;

  // Insert each answer into the answers table
  for (const answer of responseQ.answers) {
    const sentimentResponse = await fetch(
      "http://flask.heladosvillaizan.tech/clasificar-sentimiento",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comentario: answer.answer }),
      }
    );

    if (!sentimentResponse.ok) {
      throw new Error("Error fetching sentiment from the API");
    }

    const sentimentData = await sentimentResponse.json();
    const sentimiento = sentimentData.sentiment || "Neutral";
    console.log("Sentimiento:", sentimentData);
    await client.sql`
            INSERT INTO answers (response_id, question_id, answer, sentimiento)
            VALUES (${responseId}, ${answer.question_id}, ${answer.answer}, ${sentimiento})
        `;
  }
}

export async function delete_survey(surveyId: string): Promise<void> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }
  // Delete answers related to the survey
  await client.sql`
        DELETE FROM answers WHERE response_id IN (
            SELECT id FROM responses WHERE encuesta_id = ${surveyId}
        )
    `;

  // Delete responses related to the survey
  await client.sql`
        DELETE FROM responses WHERE encuesta_id = ${surveyId}
    `;

  // Delete questions related to the survey
  await client.sql`
        DELETE FROM questions WHERE encuesta_id = ${surveyId}
    `;

  // Delete the survey itself
  await client.sql`
        DELETE FROM encuestas WHERE id = ${surveyId}
    `;
}

export async function disable_survey(surveyId: string): Promise<void> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }
  await client.sql`
        UPDATE encuestas SET status = 'desactivo' WHERE id = ${surveyId}
    `;
}

export async function activate_survey(surveyId: string): Promise<void> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }
  await client.sql`
        UPDATE encuestas SET status = 'activo' WHERE id = ${surveyId}
    `;
}

export async function is_survey_available(surveyId: string): Promise<boolean> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }
  const result = await client.sql`
        SELECT * FROM encuestas WHERE id = ${surveyId} AND status = 'activo'
    `;
  return result.rows.length > 0;
}

export async function get_all_surveys(): Promise<any[]> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }
  const result = await client.sql`
        SELECT e.*, ua.username AS creator_name
    FROM encuestas e
    LEFT JOIN user_accounts ua ON e.creator_id = ua.id;
    `;
  return result.rows;
}

// SOCIAL ACCOUNTS
export async function load_all_social_accounts(): Promise<SocialAccount[]> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }
  const result = await client.sql`
        SELECT * FROM social_accounts
    `;
  return result.rows as SocialAccount[];
}

export async function add_social_account(
  social_account: SocialAccount
): Promise<void> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }
  await client.sql`
        INSERT INTO social_accounts (red_social, usuario, tipo_autenticacion, page_id, open_id, refresh_token, token_autenticacion, instagram_business_account, fecha_expiracion_token, fecha_expiracion_refresh, linked)
        VALUES (${social_account.red_social}, ${social_account.usuario}, ${social_account.tipo_autenticacion}, ${social_account.page_id}, ${social_account.open_id}, ${social_account.refresh_token}, ${social_account.token_autenticacion}, ${social_account.instagram_business_account}, ${social_account.fecha_expiracion_token}, ${social_account.fecha_expiracion_refresh}, ${social_account.linked})
    `;
}

export async function logout_social_account(red_social: string): Promise<void> {
  console.log("SE INTENTÓ BORRAR RED SOCIAL");
  // await connectToDatabase();
  // if (!client) {
  //   throw new Error("Database client is not initialized");
  // }
  // await client.sql`
  //       DELETE FROM social_accounts WHERE red_social = ${red_social}
  //   `;
}

export async function get_social_account(
  red_social: string
): Promise<SocialAccount | null> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }

  const result = await client.sql`
        SELECT * FROM social_accounts 
        WHERE red_social = ${red_social}
    `;
  return result.rows.length > 0 ? (result.rows[0] as SocialAccount) : null;
}

export async function update_meta_tokens(
  nuevoToken: string,
  nuevaFechaExpiracion: string
) {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }

  await client.sql`
        UPDATE social_accounts 
        SET token_autenticacion = ${nuevoToken}, fecha_expiracion_token = ${nuevaFechaExpiracion}
        WHERE red_social IN ('facebook', 'instagram');
    `;
}

export async function update_social_account(social_account: SocialAccount) {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }

  await client.sql`
        UPDATE social_accounts 
        SET usuario = ${social_account.usuario}, page_id = ${social_account.page_id}, open_id = ${social_account.open_id}, refresh_token = ${social_account.refresh_token}, token_autenticacion = ${social_account.token_autenticacion}, instagram_business_account = ${social_account.instagram_business_account}, fecha_expiracion_token = ${social_account.fecha_expiracion_token}, fecha_expiracion_refresh = ${social_account.fecha_expiracion_refresh}, linked = ${social_account.linked}
        WHERE red_social = ${social_account.red_social}
    `;
}

export async function get_surveys_between_dates(startDate: string, endDate: string): Promise<Encuesta[]> {
  await connectToDatabase();

  const query = `
  SELECT id, title, description, status, start_date, end_date, creator_id
  FROM Encuestas
  WHERE start_date >= $1 AND end_date <= $2
`;
  const values = [startDate, endDate];

  try {
    const result = await client!.query(query, values);
    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      start_date: row.start_date,
      end_date: row.end_date,
      creator_id: row.creator_id,
    }));
  } catch (error) {
    console.error("Error querying surveys between dates:", error);
    throw new Error("Database query failed");
  }
}

export async function getSurveyById(surveyId: string): Promise<any> {
  await connectToDatabase();
  if (!client) {
    throw new Error("Database client is not initialized");
  }

  const result = await client.sql`
    SELECT 
      e.id AS encuesta_id,
      e.title AS encuesta_title,
      e.description AS encuesta_description,
      e.status AS encuesta_status,
      e.start_date AS encuesta_start_date,
      e.end_date AS encuesta_end_date,
      q.id AS question_id,
      q.title AS question_title,
      q.type AS question_type,
      q.required AS question_required,
      q.options AS question_options,
      r.id AS response_id,
      r.date AS response_date,
      r.ip AS response_ip,
      a.id AS answer_id,
      a.answer AS answer_text,
      a.sentimiento AS answer_sentiment -- Incluye el campo sentimiento
    FROM encuestas e
    LEFT JOIN questions q ON e.id = q.encuesta_id
    LEFT JOIN responses r ON e.id = r.encuesta_id
    LEFT JOIN answers a ON q.id = a.question_id AND r.id = a.response_id
    WHERE e.id = ${surveyId} -- Filtra solo la encuesta con el ID proporcionado
    ORDER BY e.id, q.id, r.id;
  `;

  if (result.rows.length === 0) {
    throw new Error(`Survey with ID ${surveyId} not found`);
  }

  // Transformación a estructura jerárquica
  const survey = result.rows.reduce(
    (acc: any, row: any) => {
      if (!acc.id) {
        acc = {
          id: row.encuesta_id,
          title: row.encuesta_title,
          description: row.encuesta_description,
          status: row.encuesta_status,
          start_date: row.encuesta_start_date,
          end_date: row.encuesta_end_date,
          questions: [],
        };
      }

      let question = acc.questions.find((q: any) => q.id === row.question_id);
      if (!question) {
        question = {
          id: row.question_id,
          title: row.question_title,
          type: row.question_type,
          required: row.question_required,
          options: row.question_options,
          answers: [],
        };
        acc.questions.push(question);
      }

      if (row.answer_id) {
        question.answers.push({
          id: row.answer_id,
          text: row.answer_text,
          sentiment: row.answer_sentiment, // Incluye el sentimiento en la respuesta
          response: {
            id: row.response_id,
            date: row.response_date,
            ip: row.response_ip,
          },
        });
      }

      return acc;
    },
    { id: null }
  );

  return survey;
}
