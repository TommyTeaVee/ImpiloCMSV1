--
-- PostgreSQL database dump
--

-- Dumped from database version 14.13 (Homebrew)
-- Dumped by pg_dump version 15.13 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."ReadingProgress" DROP CONSTRAINT IF EXISTS "ReadingProgress_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."ReadingProgress" DROP CONSTRAINT IF EXISTS "ReadingProgress_articleId_fkey";
ALTER TABLE IF EXISTS ONLY public."ReaderEvent" DROP CONSTRAINT IF EXISTS "ReaderEvent_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."ReaderAchievement" DROP CONSTRAINT IF EXISTS "ReaderAchievement_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."ReaderAchievement" DROP CONSTRAINT IF EXISTS "ReaderAchievement_achievementId_fkey";
ALTER TABLE IF EXISTS ONLY public."QuizSession" DROP CONSTRAINT IF EXISTS "QuizSession_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."QuizSession" DROP CONSTRAINT IF EXISTS "QuizSession_quizId_fkey";
ALTER TABLE IF EXISTS ONLY public."QuizSessionQuestion" DROP CONSTRAINT IF EXISTS "QuizSessionQuestion_sessionId_fkey";
ALTER TABLE IF EXISTS ONLY public."QuizSessionQuestion" DROP CONSTRAINT IF EXISTS "QuizSessionQuestion_questionId_fkey";
ALTER TABLE IF EXISTS ONLY public."QuizQuestion" DROP CONSTRAINT IF EXISTS "QuizQuestion_quizId_fkey";
ALTER TABLE IF EXISTS ONLY public."QuizOption" DROP CONSTRAINT IF EXISTS "QuizOption_questionId_fkey";
ALTER TABLE IF EXISTS ONLY public."QuizAttempt" DROP CONSTRAINT IF EXISTS "QuizAttempt_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."QuizAttempt" DROP CONSTRAINT IF EXISTS "QuizAttempt_quizId_fkey";
ALTER TABLE IF EXISTS ONLY public."QuizAnswer" DROP CONSTRAINT IF EXISTS "QuizAnswer_questionId_fkey";
ALTER TABLE IF EXISTS ONLY public."QuizAnswer" DROP CONSTRAINT IF EXISTS "QuizAnswer_optionId_fkey";
ALTER TABLE IF EXISTS ONLY public."QuizAnswer" DROP CONSTRAINT IF EXISTS "QuizAnswer_attemptId_fkey";
ALTER TABLE IF EXISTS ONLY public."PointsTransaction" DROP CONSTRAINT IF EXISTS "PointsTransaction_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."MagazinePage" DROP CONSTRAINT IF EXISTS "MagazinePage_issueId_fkey";
ALTER TABLE IF EXISTS ONLY public."MagazinePage" DROP CONSTRAINT IF EXISTS "MagazinePage_articleId_fkey";
ALTER TABLE IF EXISTS ONLY public."Article" DROP CONSTRAINT IF EXISTS "Article_publishedById_fkey";
ALTER TABLE IF EXISTS ONLY public."Article" DROP CONSTRAINT IF EXISTS "Article_authorId_fkey";
ALTER TABLE IF EXISTS ONLY public."Article" DROP CONSTRAINT IF EXISTS "Article_approvedById_fkey";
ALTER TABLE IF EXISTS ONLY public."ArticleTag" DROP CONSTRAINT IF EXISTS "ArticleTag_tagId_fkey";
ALTER TABLE IF EXISTS ONLY public."ArticleTag" DROP CONSTRAINT IF EXISTS "ArticleTag_articleId_fkey";
ALTER TABLE IF EXISTS ONLY public."ArticleRevision" DROP CONSTRAINT IF EXISTS "ArticleRevision_createdById_fkey";
ALTER TABLE IF EXISTS ONLY public."ArticleRevision" DROP CONSTRAINT IF EXISTS "ArticleRevision_articleId_fkey";
ALTER TABLE IF EXISTS ONLY public."ArticleQuiz" DROP CONSTRAINT IF EXISTS "ArticleQuiz_articleId_fkey";
ALTER TABLE IF EXISTS ONLY public."ArticleCategory" DROP CONSTRAINT IF EXISTS "ArticleCategory_categoryId_fkey";
ALTER TABLE IF EXISTS ONLY public."ArticleCategory" DROP CONSTRAINT IF EXISTS "ArticleCategory_articleId_fkey";
ALTER TABLE IF EXISTS ONLY public."ArticleBlock" DROP CONSTRAINT IF EXISTS "ArticleBlock_mediaId_fkey";
ALTER TABLE IF EXISTS ONLY public."ArticleBlock" DROP CONSTRAINT IF EXISTS "ArticleBlock_articleId_fkey";
DROP INDEX IF EXISTS public."User_username_key";
DROP INDEX IF EXISTS public."User_readerTokenHash_key";
DROP INDEX IF EXISTS public."User_email_key";
DROP INDEX IF EXISTS public."Tag_slug_key";
DROP INDEX IF EXISTS public."Tag_name_key";
DROP INDEX IF EXISTS public."ReadingProgress_userId_idx";
DROP INDEX IF EXISTS public."ReadingProgress_articleId_idx";
DROP INDEX IF EXISTS public."ReaderEvent_userId_idx";
DROP INDEX IF EXISTS public."ReaderEvent_type_idx";
DROP INDEX IF EXISTS public."ReaderEvent_createdAt_idx";
DROP INDEX IF EXISTS public."ReaderAchievement_userId_achievementId_key";
DROP INDEX IF EXISTS public."QuizSession_userId_idx";
DROP INDEX IF EXISTS public."QuizSession_quizId_idx";
DROP INDEX IF EXISTS public."QuizSessionQuestion_sessionId_questionId_key";
DROP INDEX IF EXISTS public."QuizSessionQuestion_sessionId_idx";
DROP INDEX IF EXISTS public."QuizSessionQuestion_questionId_idx";
DROP INDEX IF EXISTS public."QuizQuestion_quizId_position_idx";
DROP INDEX IF EXISTS public."QuizOption_questionId_position_idx";
DROP INDEX IF EXISTS public."QuizAttempt_userId_idx";
DROP INDEX IF EXISTS public."QuizAttempt_quizId_idx";
DROP INDEX IF EXISTS public."QuizAnswer_questionId_idx";
DROP INDEX IF EXISTS public."QuizAnswer_attemptId_idx";
DROP INDEX IF EXISTS public."PointsTransaction_userId_idx";
DROP INDEX IF EXISTS public."PointsTransaction_createdAt_idx";
DROP INDEX IF EXISTS public."MagazinePage_issueId_position_key";
DROP INDEX IF EXISTS public."MagazinePage_issueId_idx";
DROP INDEX IF EXISTS public."MagazinePage_articleId_idx";
DROP INDEX IF EXISTS public."MagazineIssue_slug_key";
DROP INDEX IF EXISTS public."MagazineIssue_publishedAt_idx";
DROP INDEX IF EXISTS public."Category_slug_key";
DROP INDEX IF EXISTS public."Article_status_idx";
DROP INDEX IF EXISTS public."Article_slug_key";
DROP INDEX IF EXISTS public."Article_publishedAt_idx";
DROP INDEX IF EXISTS public."Article_authorId_idx";
DROP INDEX IF EXISTS public."ArticleTag_tagId_idx";
DROP INDEX IF EXISTS public."ArticleRevision_createdById_idx";
DROP INDEX IF EXISTS public."ArticleRevision_articleId_version_key";
DROP INDEX IF EXISTS public."ArticleQuiz_articleId_key";
DROP INDEX IF EXISTS public."ArticleCategory_categoryId_idx";
DROP INDEX IF EXISTS public."ArticleBlock_articleId_position_idx";
DROP INDEX IF EXISTS public."Achievement_code_key";
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."Tag" DROP CONSTRAINT IF EXISTS "Tag_pkey";
ALTER TABLE IF EXISTS ONLY public."ReadingProgress" DROP CONSTRAINT IF EXISTS "ReadingProgress_pkey";
ALTER TABLE IF EXISTS ONLY public."ReaderEvent" DROP CONSTRAINT IF EXISTS "ReaderEvent_pkey";
ALTER TABLE IF EXISTS ONLY public."ReaderAchievement" DROP CONSTRAINT IF EXISTS "ReaderAchievement_pkey";
ALTER TABLE IF EXISTS ONLY public."QuizSession" DROP CONSTRAINT IF EXISTS "QuizSession_pkey";
ALTER TABLE IF EXISTS ONLY public."QuizSessionQuestion" DROP CONSTRAINT IF EXISTS "QuizSessionQuestion_pkey";
ALTER TABLE IF EXISTS ONLY public."QuizQuestion" DROP CONSTRAINT IF EXISTS "QuizQuestion_pkey";
ALTER TABLE IF EXISTS ONLY public."QuizOption" DROP CONSTRAINT IF EXISTS "QuizOption_pkey";
ALTER TABLE IF EXISTS ONLY public."QuizAttempt" DROP CONSTRAINT IF EXISTS "QuizAttempt_pkey";
ALTER TABLE IF EXISTS ONLY public."QuizAnswer" DROP CONSTRAINT IF EXISTS "QuizAnswer_pkey";
ALTER TABLE IF EXISTS ONLY public."PointsTransaction" DROP CONSTRAINT IF EXISTS "PointsTransaction_pkey";
ALTER TABLE IF EXISTS ONLY public."MediaAsset" DROP CONSTRAINT IF EXISTS "MediaAsset_pkey";
ALTER TABLE IF EXISTS ONLY public."MagazinePage" DROP CONSTRAINT IF EXISTS "MagazinePage_pkey";
ALTER TABLE IF EXISTS ONLY public."MagazineIssue" DROP CONSTRAINT IF EXISTS "MagazineIssue_pkey";
ALTER TABLE IF EXISTS ONLY public."Category" DROP CONSTRAINT IF EXISTS "Category_pkey";
ALTER TABLE IF EXISTS ONLY public."Article" DROP CONSTRAINT IF EXISTS "Article_pkey";
ALTER TABLE IF EXISTS ONLY public."ArticleTag" DROP CONSTRAINT IF EXISTS "ArticleTag_pkey";
ALTER TABLE IF EXISTS ONLY public."ArticleRevision" DROP CONSTRAINT IF EXISTS "ArticleRevision_pkey";
ALTER TABLE IF EXISTS ONLY public."ArticleQuiz" DROP CONSTRAINT IF EXISTS "ArticleQuiz_pkey";
ALTER TABLE IF EXISTS ONLY public."ArticleCategory" DROP CONSTRAINT IF EXISTS "ArticleCategory_pkey";
ALTER TABLE IF EXISTS ONLY public."ArticleBlock" DROP CONSTRAINT IF EXISTS "ArticleBlock_pkey";
ALTER TABLE IF EXISTS ONLY public."Achievement" DROP CONSTRAINT IF EXISTS "Achievement_pkey";
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."Tag";
DROP TABLE IF EXISTS public."ReadingProgress";
DROP TABLE IF EXISTS public."ReaderEvent";
DROP TABLE IF EXISTS public."ReaderAchievement";
DROP TABLE IF EXISTS public."QuizSessionQuestion";
DROP TABLE IF EXISTS public."QuizSession";
DROP TABLE IF EXISTS public."QuizQuestion";
DROP TABLE IF EXISTS public."QuizOption";
DROP TABLE IF EXISTS public."QuizAttempt";
DROP TABLE IF EXISTS public."QuizAnswer";
DROP TABLE IF EXISTS public."PointsTransaction";
DROP TABLE IF EXISTS public."MediaAsset";
DROP TABLE IF EXISTS public."MagazinePage";
DROP TABLE IF EXISTS public."MagazineIssue";
DROP TABLE IF EXISTS public."Category";
DROP TABLE IF EXISTS public."ArticleTag";
DROP TABLE IF EXISTS public."ArticleRevision";
DROP TABLE IF EXISTS public."ArticleQuiz";
DROP TABLE IF EXISTS public."ArticleCategory";
DROP TABLE IF EXISTS public."ArticleBlock";
DROP TABLE IF EXISTS public."Article";
DROP TABLE IF EXISTS public."Achievement";
DROP TYPE IF EXISTS public."UserRole";
DROP TYPE IF EXISTS public."ReportStatus";
DROP TYPE IF EXISTS public."ReaderEventType";
DROP TYPE IF EXISTS public."MagazinePageType";
DROP TYPE IF EXISTS public."CommentStatus";
DROP TYPE IF EXISTS public."ArticleStatus";
DROP TYPE IF EXISTS public."ArticleBlockType";
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: thomastemp
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO thomastemp;

--
-- Name: ArticleBlockType; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."ArticleBlockType" AS ENUM (
    'TEXT',
    'HEADING',
    'IMAGE',
    'QUOTE',
    'VIDEO',
    'AUDIO',
    'GALLERY',
    'EMBED'
);


ALTER TYPE public."ArticleBlockType" OWNER TO admin;

--
-- Name: ArticleStatus; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."ArticleStatus" AS ENUM (
    'DRAFT',
    'IN_REVIEW',
    'APPROVED',
    'PUBLISHED',
    'ARCHIVED'
);


ALTER TYPE public."ArticleStatus" OWNER TO admin;

--
-- Name: CommentStatus; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."CommentStatus" AS ENUM (
    'VISIBLE',
    'HIDDEN',
    'FLAGGED',
    'REMOVED'
);


ALTER TYPE public."CommentStatus" OWNER TO admin;

--
-- Name: MagazinePageType; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."MagazinePageType" AS ENUM (
    'COVER',
    'HIGHLIGHTS',
    'ABOUT',
    'PRIVACY',
    'CONTACT',
    'CONTENTS',
    'ARTICLE',
    'AD',
    'STATIC',
    'GAME'
);


ALTER TYPE public."MagazinePageType" OWNER TO admin;

--
-- Name: ReaderEventType; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."ReaderEventType" AS ENUM (
    'ARTICLE_VIEWED',
    'ARTICLE_COMPLETED',
    'ISSUE_STARTED',
    'ISSUE_COMPLETED',
    'PAGE_VIEWED',
    'VIDEO_STARTED',
    'VIDEO_COMPLETED',
    'COMMENT_CREATED',
    'COMMENT_LIKED',
    'ARTICLE_SAVED',
    'ACHIEVEMENT_EARNED',
    'QUIZ_STARTED',
    'QUIZ_COMPLETED'
);


ALTER TYPE public."ReaderEventType" OWNER TO admin;

--
-- Name: ReportStatus; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."ReportStatus" AS ENUM (
    'OPEN',
    'REVIEWED',
    'RESOLVED',
    'DISMISSED'
);


ALTER TYPE public."ReportStatus" OWNER TO admin;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."UserRole" AS ENUM (
    'ADMIN',
    'EDITOR',
    'WRITER',
    'READER',
    'MODERATOR'
);


ALTER TYPE public."UserRole" OWNER TO admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Achievement; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Achievement" (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    icon text,
    points integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Achievement" OWNER TO admin;

--
-- Name: Article; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Article" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text,
    status public."ArticleStatus" DEFAULT 'DRAFT'::public."ArticleStatus" NOT NULL,
    "wordCount" integer DEFAULT 0 NOT NULL,
    "authorId" text NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "approvedAt" timestamp(3) without time zone,
    "approvedById" text,
    "publishedById" text
);


ALTER TABLE public."Article" OWNER TO admin;

--
-- Name: ArticleBlock; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."ArticleBlock" (
    id text NOT NULL,
    "articleId" text NOT NULL,
    type public."ArticleBlockType" NOT NULL,
    "position" integer NOT NULL,
    content jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "mediaId" text
);


ALTER TABLE public."ArticleBlock" OWNER TO admin;

--
-- Name: ArticleCategory; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."ArticleCategory" (
    "articleId" text NOT NULL,
    "categoryId" text NOT NULL
);


ALTER TABLE public."ArticleCategory" OWNER TO admin;

--
-- Name: ArticleQuiz; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."ArticleQuiz" (
    id text NOT NULL,
    "articleId" text NOT NULL,
    title text NOT NULL,
    description text,
    "passingScore" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ArticleQuiz" OWNER TO admin;

--
-- Name: ArticleRevision; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."ArticleRevision" (
    id text NOT NULL,
    "articleId" text NOT NULL,
    version integer NOT NULL,
    title text NOT NULL,
    excerpt text,
    content jsonb NOT NULL,
    "createdById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ArticleRevision" OWNER TO admin;

--
-- Name: ArticleTag; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."ArticleTag" (
    "articleId" text NOT NULL,
    "tagId" text NOT NULL
);


ALTER TABLE public."ArticleTag" OWNER TO admin;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Category" OWNER TO admin;

--
-- Name: MagazineIssue; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."MagazineIssue" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text,
    "issueNumber" integer,
    volume text,
    "coverUrl" text,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."MagazineIssue" OWNER TO admin;

--
-- Name: MagazinePage; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."MagazinePage" (
    id text NOT NULL,
    "issueId" text NOT NULL,
    "position" integer NOT NULL,
    type public."MagazinePageType" NOT NULL,
    title text,
    slug text,
    "articleId" text,
    content jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."MagazinePage" OWNER TO admin;

--
-- Name: MediaAsset; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."MediaAsset" (
    id text NOT NULL,
    url text NOT NULL,
    type text NOT NULL,
    "mimeType" text,
    filename text,
    "altText" text,
    caption text,
    credit text,
    width integer,
    height integer,
    duration integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "externalId" text,
    provider text NOT NULL
);


ALTER TABLE public."MediaAsset" OWNER TO admin;

--
-- Name: PointsTransaction; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."PointsTransaction" (
    id text NOT NULL,
    "userId" text NOT NULL,
    points integer NOT NULL,
    reason text NOT NULL,
    "eventId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PointsTransaction" OWNER TO admin;

--
-- Name: QuizAnswer; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."QuizAnswer" (
    id text NOT NULL,
    "attemptId" text NOT NULL,
    "questionId" text NOT NULL,
    "optionId" text,
    "isCorrect" boolean NOT NULL,
    points integer NOT NULL,
    "hintsUsed" integer DEFAULT 0 NOT NULL,
    "attemptsUsed" integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."QuizAnswer" OWNER TO admin;

--
-- Name: QuizAttempt; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."QuizAttempt" (
    id text NOT NULL,
    "quizId" text NOT NULL,
    "userId" text NOT NULL,
    score integer NOT NULL,
    total integer NOT NULL,
    percentage double precision NOT NULL,
    "completedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "attemptNumber" integer DEFAULT 1 NOT NULL,
    "attemptPenalty" integer DEFAULT 0 NOT NULL,
    "basePoints" integer DEFAULT 0 NOT NULL,
    "hintPenalty" integer DEFAULT 0 NOT NULL,
    "hintsUsed" integer DEFAULT 0 NOT NULL,
    "retriesUsed" integer DEFAULT 0 NOT NULL,
    "retryPenalty" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."QuizAttempt" OWNER TO admin;

--
-- Name: QuizOption; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."QuizOption" (
    id text NOT NULL,
    "questionId" text NOT NULL,
    text text NOT NULL,
    "isCorrect" boolean DEFAULT false NOT NULL,
    "position" integer NOT NULL
);


ALTER TABLE public."QuizOption" OWNER TO admin;

--
-- Name: QuizQuestion; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."QuizQuestion" (
    id text NOT NULL,
    "quizId" text NOT NULL,
    question text NOT NULL,
    "position" integer NOT NULL,
    hint text
);


ALTER TABLE public."QuizQuestion" OWNER TO admin;

--
-- Name: QuizSession; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."QuizSession" (
    id text NOT NULL,
    "quizId" text NOT NULL,
    "userId" text NOT NULL,
    "startedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "completedAt" timestamp(3) without time zone
);


ALTER TABLE public."QuizSession" OWNER TO admin;

--
-- Name: QuizSessionQuestion; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."QuizSessionQuestion" (
    id text NOT NULL,
    "sessionId" text NOT NULL,
    "questionId" text NOT NULL,
    "hintsUsed" integer DEFAULT 0 NOT NULL,
    "attemptsUsed" integer DEFAULT 0 NOT NULL,
    answered boolean DEFAULT false NOT NULL,
    "isCorrect" boolean,
    "optionId" text
);


ALTER TABLE public."QuizSessionQuestion" OWNER TO admin;

--
-- Name: ReaderAchievement; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."ReaderAchievement" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "achievementId" text NOT NULL,
    "earnedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ReaderAchievement" OWNER TO admin;

--
-- Name: ReaderEvent; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."ReaderEvent" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type public."ReaderEventType" NOT NULL,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ReaderEvent" OWNER TO admin;

--
-- Name: ReadingProgress; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."ReadingProgress" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "articleId" text,
    "issueId" text,
    progress double precision DEFAULT 0 NOT NULL,
    "position" integer DEFAULT 0 NOT NULL,
    "startedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lastReadAt" timestamp(3) without time zone NOT NULL,
    "completedAt" timestamp(3) without time zone
);


ALTER TABLE public."ReadingProgress" OWNER TO admin;

--
-- Name: Tag; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Tag" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Tag" OWNER TO admin;

--
-- Name: User; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."User" (
    id text NOT NULL,
    username text NOT NULL,
    "displayName" text,
    role public."UserRole" DEFAULT 'READER'::public."UserRole" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    email text,
    "passwordHash" text,
    "avatarUrl" text,
    "readerTokenHash" text
);


ALTER TABLE public."User" OWNER TO admin;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO admin;

--
-- Data for Name: Achievement; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Achievement" (id, code, name, description, icon, points, "createdAt") FROM stdin;
d5e04d6e-07e7-42c6-9bb6-e4fec73789b0	FIRST_QUIZ	First Quiz	Completed your first IMPILO quiz.	\N	25	2026-08-09 23:49:01.175
\.


--
-- Data for Name: Article; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Article" (id, title, slug, excerpt, status, "wordCount", "authorId", "publishedAt", "createdAt", "updatedAt", "approvedAt", "approvedById", "publishedById") FROM stdin;
918474bc-6bc6-4472-9803-720c806669c1	drone era	drone-era		DRAFT	5	97edeec0-383c-42b5-b645-8f0ac9f9e756	\N	2026-08-13 00:39:47.698	2026-08-30 22:50:46.802	\N	\N	\N
cd838ff1-d0f0-46b5-b9e3-380d14f0b179	Fifa's Billion Dollar Own goal	fifa-own-goal	"In football, an own goal is often remembered longer than a winning strike. In business, an own goal can reshape an entire industry."	DRAFT	1844	97edeec0-383c-42b5-b645-8f0ac9f9e756	\N	2026-08-19 14:11:12.883	2026-09-04 09:25:06.4	\N	\N	\N
f078b5ad-35f8-4695-a999-4e40b2ad80cf	What If Your Bank Becomes Your Gateway to Government?	what-if-your-bank-becomes-your-gateway-to-government	Is this customer service, a marketing strategy — or the beginning of a completely different relationship between citizens, banks and the state? Imagine walking into your bank. You are not there to withdraw money. You are not applying for a loan. You are not opening an investment account. You are there because you need a South African Smart ID. And instead of travelling to a Department of Home Affairs office, standing in a queue and filling out paperwork, you walk over to a digital terminal inside your bank branch, verify your identity using biometrics, complete the application and leave. A few minutes	DRAFT	2878	97edeec0-383c-42b5-b645-8f0ac9f9e756	\N	2026-09-04 09:26:43.817	2026-09-04 09:26:49.979	\N	\N	\N
04c55b40-d1b1-4ce8-abdc-7aaddd9f9481	FAR FETCHED The Body That Held HIV Down: Scientists Discover a Remarkable New Clue in the Fight Against the Virus	far-fetched-the-body-that-held-hiv-down-scientists-discover-a-remarkable-new-clue-in-the-fight-against-the-virus	For decades, one of the biggest challenges in the fight against HIV has been remarkably simple to describe and extraordinarily difficult to solve: How do you stop the virus without having to keep taking medication forever?	DRAFT	1510	97edeec0-383c-42b5-b645-8f0ac9f9e756	\N	2026-09-04 09:28:07.743	2026-09-04 09:28:07.743	\N	\N	\N
d3e0aa7c-aeb1-42af-b73e-c62d06cdee0b	Edited	cms-test-article	Testing the new IMPILO editorial CMS.	DRAFT	14	97edeec0-383c-42b5-b645-8f0ac9f9e756	\N	2026-08-12 21:53:04.104	2026-08-12 22:11:26.09	\N	\N	\N
b441bd88-cff7-4ee1-9de4-9363e9e097b3	Media Article	media-article	article with media	DRAFT	1	97edeec0-383c-42b5-b645-8f0ac9f9e756	\N	2026-08-12 23:54:05.547	2026-08-12 23:54:05.547	\N	\N	\N
7e1622c1-d569-47d6-b51d-f29fc77d3eeb	Ai ads	ai-ads	this is ai ad	DRAFT	0	97edeec0-383c-42b5-b645-8f0ac9f9e756	\N	2026-08-13 00:24:01.689	2026-08-13 00:33:02.567	\N	\N	\N
b8e83af3-54c3-46b9-b0bf-ee4a9f5924cf	IMPILO Magazine Is Building a New Kind of Showbiz	impilo-magazine-new-kind-of-showbiz	IMPILO is moving beyond the traditional magazine model, connecting editorial storytelling, fashion, creative profiles, video, portfolios and community into a new kind of African showbiz platform.	PUBLISHED	933	97edeec0-383c-42b5-b645-8f0ac9f9e756	2026-08-09 18:40:53.157	2026-08-09 16:42:30.758	2026-10-21 10:35:32.566	2026-08-09 18:13:05.701	97edeec0-383c-42b5-b645-8f0ac9f9e756	97edeec0-383c-42b5-b645-8f0ac9f9e756
ba494146-681e-4b00-b9af-d13382b3d0da	The Silent Invasion: Is the Indian Myna Winning the Battle Against South Africa's Native Birds?	the-silent-invasion-is-the-indian-myna-winning-the-battle-against-south-africas-native-birds	\N	DRAFT	1190	97edeec0-383c-42b5-b645-8f0ac9f9e756	\N	2026-09-04 09:42:47.354	2026-09-04 09:42:47.354	\N	\N	\N
ad3ae4af-e706-4dab-90c3-6c896b1a1f41	Who is paying for this AI :?	who-is-paying-for-this-ai	Who is Paying for This AI? The Trillion-Dollar Ecosystem and the Hidden Currency of Prompts The generative artificial intelligence boom represents one of the most aggressive and capital-intensive technological arms races in human history. Training a single "frontier" model—the massive AI engines that power modern chatbots and image generators—requires an astonishing amount of resources. We are talking about tens of thousands of highly specialized GPUs, gigawatts of electricity, massive cooling infrastructure, and salaries for elite engineering talent that rival those of top-tier athletes.	PUBLISHED	1158	97edeec0-383c-42b5-b645-8f0ac9f9e756	2026-10-11 00:36:50.312	2026-09-17 15:19:47.513	2026-10-19 11:55:44.569	2026-10-11 00:36:47.249	97edeec0-383c-42b5-b645-8f0ac9f9e756	97edeec0-383c-42b5-b645-8f0ac9f9e756
98bf1363-e317-46d7-ae6b-bdb356488712	Aviary  Under Siege: The Silent Invasion	aviary-under-siege	The Silent Invasion: Is the Indian Myna Winning the Battle Against South Africa's Native Birds?	DRAFT	1190	97edeec0-383c-42b5-b645-8f0ac9f9e756	\N	2026-09-04 09:34:57.832	2026-09-14 15:06:29.184	\N	\N	\N
fd6cb283-2d67-4d3c-a7c3-ed7cbd682b23	Ai-wars	ai-wairs		DRAFT	9	97edeec0-383c-42b5-b645-8f0ac9f9e756	\N	2026-10-09 08:33:38.829	2026-10-11 00:35:51.353	\N	\N	\N
d92b0878-ba9d-41f1-aa4c-1e0b35948e48	Before the Nation Had a Name: Honouring the Khoisan Heritage of South Africa	before-the-nation-had-a-name-honouring-the-khoisan-heritage-of-south-africa	Long before South Africa became a country defined by provinces, borders, cities and modern political identities, the landscapes we now call home were inhabited by communities whose histories stretch back thousands of years.	DRAFT	1904	97edeec0-383c-42b5-b645-8f0ac9f9e756	\N	2026-09-23 12:06:42.54	2026-10-21 14:23:44.599	\N	\N	\N
\.


--
-- Data for Name: ArticleBlock; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."ArticleBlock" (id, "articleId", type, "position", content, "createdAt", "updatedAt", "mediaId") FROM stdin;
30b00888-b93e-4808-ae28-ac0411f9dda2	918474bc-6bc6-4472-9803-720c806669c1	TEXT	0	{"text": "era of drones for building "}	2026-08-30 22:50:46.802	2026-08-30 22:50:46.802	\N
3e2f84ff-6be6-48db-936d-8e764cd7abd7	918474bc-6bc6-4472-9803-720c806669c1	VIDEO	1	{"layout": "full"}	2026-08-30 22:50:46.802	2026-08-30 22:50:46.802	4c57deb0-d4e9-4583-8422-6a1da13daec2
37106814-1dd9-4e25-994b-3cc3f65e07f3	918474bc-6bc6-4472-9803-720c806669c1	TEXT	2	{"text": ""}	2026-08-30 22:50:46.802	2026-08-30 22:50:46.802	\N
a392532b-18b5-47e8-829d-050234cd9fcd	04c55b40-d1b1-4ce8-abdc-7aaddd9f9481	TEXT	0	{"text": "FAR FETCHED The Body That Held HIV Down: Scientists Discover a Remarkable New Clue in the Fight Against the Virus By IMPILO Editorial For decades, one of the biggest challenges in the fight against HIV has been remarkably simple to describe and extraordinarily difficult to solve: How do you stop the virus without having to keep taking medication forever? Modern antiretroviral therapy has transformed HIV from a once frequently fatal illness into a manageable chronic condition for people who have access to effective treatment. When treatment is taken as prescribed, it can suppress HIV to undetectable levels and allow people to live long, healthy lives. But HIV has a particularly frustrating trick. Even when treatment suppresses the virus, HIV can leave copies of its genetic material hidden inside certain cells. These reservoirs can remain in the body for years. Stop treatment, and in most people the virus can eventually begin reproducing again. Now, researchers in Denmark have reported an extraordinary finding that gives scientists another clue about how the immune system might one day be trained or assisted to control HIV for much longer without continuous antiretroviral treatment. And yes, the headline sounds almost far fetched. But the science is real. Three people. One extraordinary experiment. Researchers associated with Aarhus University Hospital studied three people living with HIV who had previously participated in clinical research involving broadly neutralising antibodies, commonly called bNAbs. These are laboratory-produced antibodies designed to recognise parts of HIV that are difficult for the virus to change. Instead of attacking the virus in the same way conventional medicines do, the antibodies can attach themselves to HIV and prevent susceptible virus particles from infecting new cells. The researchers then observed what happened when antiretroviral treatment was interrupted under controlled research conditions. What happened next was remarkable. Two of the three participants were able to keep HIV under control for more than six and seven years, respectively, without returning to conventional antiretroviral therapy during that period. Both remained healthy. The third participant also controlled the virus for approximately two and a half years before HIV eventually rebounded. That third case may be just as scientifically important as the two successes. Researchers found evidence that the virus had changed sufficiently to escape the pressures being placed on it by both the antibody response and the person's HIV-specific immune response. In other words, HIV had found a way out. The immune system had help The most interesting part of the research isn't simply that two people remained off treatment. It is why. The researchers found that the two long-term controllers had unusually strong immune responses involving both broadly neutralising antibodies and HIV-specific T cells. Think of it as a security system with two different layers. The antibodies act as one line of defence, recognising and neutralising vulnerable forms of the virus. The immune system's T cells provide another layer, identifying and responding to infected cells. If HIV manages to change enough to escape one defence, it may still encounter the other. That appears to be what happened in the two people who maintained long-term control. The researchers describe the interaction between these immune responses as an important clue for developing future HIV remission strategies. And that word — remission — matters. This is NOT a cure There is an enormous difference between controlling HIV and eliminating HIV. The study does not show that HIV has been removed from the bodies of these participants. Researchers were able to detect evidence of HIV reservoirs, including genetically intact and inducible virus. The virus was still there. It was simply being kept under control. That distinction is critical. Calling this a \\"cure\\" would therefore be misleading. The achievement is better described as long-term treatment-free control of HIV in two individuals following an experimental intervention. That is scientifically fascinating. It is also nowhere near the point where people should stop taking their prescribed HIV medication. Why Africa matters For Africa, developments in HIV research carry a particular significance. Millions of people across the continent live with HIV, and lifelong access to medication, healthcare services, testing, treatment monitoring and adherence support remains an enormous public-health priority. That makes the idea of long-term HIV remission particularly compelling. Imagine a future in which an intervention could help the immune system maintain control of HIV for years rather than requiring daily medication indefinitely. That could potentially change the way HIV is managed. But we need to separate what researchers hope this work could eventually lead to from what the study has actually demonstrated. This study involved only three people. Two produced extraordinary results. One eventually experienced viral rebound. That is nowhere near enough evidence to establish a treatment that can be safely given to the wider population. It certainly does not demonstrate that people living with HIV in Africa can stop taking antiretroviral medication. HIV is an expert escape artist One of the most fascinating — and frustrating — aspects of HIV is its ability to evolve. When HIV replicates, mutations can occur. Some of those mutations can make the virus less vulnerable to a particular immune response. The third participant provides an example of exactly why HIV researchers remain cautious. The virus eventually accumulated changes that helped it escape both antibody-mediated and cellular immune pressure. This is one of the central problems scientists face in developing an HIV cure. The virus doesn't necessarily have to defeat one defence. It can evolve around it. The Danish research suggests that attacking HIV from multiple immunological directions may make that escape considerably harder. That does not mean escape is impossible. It means scientists may have discovered another piece of the puzzle. The bigger question The really exciting question is no longer simply: \\"Can HIV be suppressed?\\" We already know the answer. Modern antiretroviral therapy can suppress HIV extremely effectively. The bigger scientific question is: \\"Can we teach, strengthen or redirect the immune system so that it can maintain control of HIV without continuous medication?\\" The Danish study provides an intriguing glimpse of what that might look like. Researchers are now interested in understanding what made the two successful cases different. Why were their immune responses so effective? Why did the combination of antibodies and T cells work so well? Could those characteristics be deliberately reproduced in other people? Could future therapies stimulate similar immune responses? And could combinations of antibodies, vaccines, immune-based therapies and other interventions eventually produce sustained HIV remission? Those questions remain unanswered. From far-fetched to scientifically plausible? Science has a long history of ideas that once sounded impossible becoming possible. But science also has a long history of exciting early findings failing to translate into practical treatments. That is why this discovery belongs in Far Fetched — not because the research is fake or fantasy, but because we are looking at the boundary between what is currently demonstrated and what scientists hope may eventually become possible. Two people maintaining HIV control for more than six years after stopping conventional treatment is extraordinary. Three people are not enough to rewrite global HIV treatment guidelines. But three people may be enough to give researchers an important clue. The clue is that the human immune system may be capable of much more against HIV when it receives the right assistance. The challenge now is figuring out whether that extraordinary response can be reproduced safely, reliably and at scale. For now, the virus has not been eliminated. It has simply been held down. And that may be one of the most intriguing clues yet in the decades-long search for a way to make that control last.", "layout": "default"}	2026-09-04 09:28:07.743	2026-09-04 09:28:07.743	\N
b61223d4-0599-4258-991f-f6f99e89a202	04c55b40-d1b1-4ce8-abdc-7aaddd9f9481	TEXT	1	{"text": "⚠️ IMPILO HEALTH & SAFETY DISCLAIMER This article is provided for general information and educational purposes only. It is not medical advice, diagnosis or treatment. IMPILO Magazine does not recommend stopping, changing, delaying or replacing antiretroviral therapy (ART) or any other prescribed HIV treatment on the basis of this article. The research discussed here involved a very small number of participants in a controlled research setting and investigated an experimental immune-based approach. The findings do not establish that HIV has been cured, nor do they demonstrate that people living with HIV can safely stop taking their prescribed medication. Anyone living with HIV should continue their treatment exactly as prescribed by their healthcare professional and should speak to a qualified doctor, HIV clinician or other appropriate healthcare professional before making any changes to treatment. The experience of participants in a clinical research study should not be interpreted as evidence that the same outcome will occur in other people. IMPILO Magazine does not provide individual medical recommendations. Readers should consult qualified healthcare professionals and reputable public-health organisations for advice about HIV prevention, testing and treatment. Research source: Fisher K. et al., Nature Immunology, 2026, 27(4):812–826. DOI: 10.1038/s41590-026-02448-z. Research conducted by investigators associated with Aarhus University Hospital and collaborators. Editorial note: The findings reported in this article are preliminary in the context of developing broadly applicable HIV-remission strategies. Further research involving larger numbers of participants and longer follow-up is required before any such approach could be considered a standard treatment.", "layout": "default"}	2026-09-04 09:28:07.743	2026-09-04 09:28:07.743	\N
e621e36e-95d4-4929-b60e-3a462f7f91ef	ad3ae4af-e706-4dab-90c3-6c896b1a1f41	TEXT	0	{"text": "Who is Paying for This AI? The Trillion-Dollar Ecosystem and the Hidden Currency of Prompts The generative artificial intelligence boom represents one of the most aggressive and capital-intensive technological arms races in human history. Training a single \\"frontier\\" model—the massive AI engines that power modern chatbots and image generators—requires an astonishing amount of resources. We are talking about tens of thousands of highly specialized GPUs, gigawatts of electricity, massive cooling infrastructure, and salaries for elite engineering talent that rival those of top-tier athletes.", "layout": "default", "editorialLayout": {"role": "eyebrow", "theme": "LIME", "template": "EDUCATIONAL"}}	2026-10-19 11:55:44.569	2026-10-19 11:55:44.569	\N
d0451a0d-95ec-4d77-828b-d2a0779ac284	ad3ae4af-e706-4dab-90c3-6c896b1a1f41	IMAGE	1	{"layout": "full", "editorialLayout": {"role": "hero", "theme": "LIME", "template": "EDUCATIONAL"}}	2026-10-19 11:55:44.569	2026-10-19 11:55:44.569	ef081cab-5210-4155-b6e2-3d0b80f31fd9
c43f85bd-6aef-4409-90c7-cf1f0ec6df1b	ad3ae4af-e706-4dab-90c3-6c896b1a1f41	QUOTE	2	{"text": "Key insight: \\"The flow of human data is just as critical as the flow of capital; without continuous new prompt data, models risk stagnation or \\"model collapse\\" when trained purely on their own outputs.\\"", "editorialLayout": {"role": "pull-quote", "theme": "LIME", "template": "EDUCATIONAL"}}	2026-10-19 11:55:44.569	2026-10-19 11:55:44.569	\N
7e7c1086-a46c-4564-86ca-a3436d539ff3	ad3ae4af-e706-4dab-90c3-6c896b1a1f41	TEXT	3	{"text": "With operational and training costs easily reaching into the hundreds of millions (if not billions) of dollars for a single company, a profound question arises: Who is actually footing the bill for this unprecedented expenditure? The answer is a complex web of corporate subsidies, venture capital, direct consumer payments, and a hidden, invaluable currency—your data.\\n\\nThe Financial Payers: Who is Writing the Checks? The economic burden of the AI revolution is currently distributed across a few major financial pillars:", "layout": "default", "editorialLayout": {"role": "deck", "theme": "LIME", "template": "EDUCATIONAL"}}	2026-10-19 11:55:44.569	2026-10-19 11:55:44.569	\N
99efc0fb-77bb-4550-88a4-a5deaca2e62d	fd6cb283-2d67-4d3c-a7c3-ed7cbd682b23	TEXT	0	{"text": "PROFILE / EDITORIAL", "editorialLayout": {"role": "eyebrow", "theme": "PURPLE", "template": "PROFILE"}}	2026-10-11 00:35:51.353	2026-10-11 00:35:51.353	\N
7fda3095-6009-484f-9cbd-6f50d46682dc	fd6cb283-2d67-4d3c-a7c3-ed7cbd682b23	HEADING	1	{"text": "Ai-wars", "editorialLayout": {"role": "title", "theme": "PURPLE", "template": "PROFILE"}}	2026-10-11 00:35:51.353	2026-10-11 00:35:51.353	\N
2512f982-cd42-4bd3-a2ea-8e17b042b764	fd6cb283-2d67-4d3c-a7c3-ed7cbd682b23	TEXT	2	{"text": "", "editorialLayout": {"role": "deck", "theme": "PURPLE", "template": "PROFILE"}}	2026-10-11 00:35:51.353	2026-10-11 00:35:51.353	\N
90ba1b16-4312-4b5d-a435-0b2ab2b6988d	fd6cb283-2d67-4d3c-a7c3-ed7cbd682b23	IMAGE	3	{"text": "", "editorialLayout": {"role": "portrait-hero", "theme": "PURPLE", "template": "PROFILE"}}	2026-10-11 00:35:51.353	2026-10-11 00:35:51.353	919b7011-4d2c-4927-98e4-200ade910299
8b0c0f96-88c5-4916-aa3b-d26f5999a6cf	fd6cb283-2d67-4d3c-a7c3-ed7cbd682b23	QUOTE	4	{"text": "", "editorialLayout": {"role": "signature-quote", "theme": "PURPLE", "template": "PROFILE"}}	2026-10-11 00:35:51.353	2026-10-11 00:35:51.353	\N
c36c2965-3edf-4d16-a17e-268ac06508f6	fd6cb283-2d67-4d3c-a7c3-ed7cbd682b23	HEADING	5	{"text": "Editorial Biography", "editorialLayout": {"role": "section-heading", "theme": "PURPLE", "template": "PROFILE"}}	2026-10-11 00:35:51.353	2026-10-11 00:35:51.353	\N
8dab8383-afdf-4333-9ed5-bd3a533acf52	fd6cb283-2d67-4d3c-a7c3-ed7cbd682b23	TEXT	6	{"text": "", "editorialLayout": {"role": "body-left", "theme": "PURPLE", "template": "PROFILE"}}	2026-10-11 00:35:51.353	2026-10-11 00:35:51.353	\N
d7e075b3-88a1-45a7-badc-0b00e3f19007	fd6cb283-2d67-4d3c-a7c3-ed7cbd682b23	TEXT	7	{"text": "", "editorialLayout": {"role": "body-right", "theme": "PURPLE", "template": "PROFILE"}}	2026-10-11 00:35:51.353	2026-10-11 00:35:51.353	\N
08b3c9ec-18cd-4cd0-b5e9-c5ed0075c03b	fd6cb283-2d67-4d3c-a7c3-ed7cbd682b23	HEADING	8	{"text": "Career & Direction", "editorialLayout": {"role": "section-heading", "theme": "PURPLE", "template": "PROFILE"}}	2026-10-11 00:35:51.353	2026-10-11 00:35:51.353	\N
fca4f7e3-df6a-4458-9760-a98bfac99f75	fd6cb283-2d67-4d3c-a7c3-ed7cbd682b23	TEXT	9	{"text": "", "editorialLayout": {"role": "body-left", "theme": "PURPLE", "template": "PROFILE"}}	2026-10-11 00:35:51.353	2026-10-11 00:35:51.353	\N
75e29c95-b032-470c-9aea-00a6083ce566	fd6cb283-2d67-4d3c-a7c3-ed7cbd682b23	TEXT	10	{"text": "", "editorialLayout": {"role": "body-right", "theme": "PURPLE", "template": "PROFILE"}}	2026-10-11 00:35:51.353	2026-10-11 00:35:51.353	\N
0d9116df-5ce1-4ef9-9f70-117842f2ec48	ad3ae4af-e706-4dab-90c3-6c896b1a1f41	TEXT	4	{"text": "1. Big Tech’s Strategic \\"War Chests\\" The primary financiers of the AI era are the trillion-dollar tech behemoths: Microsoft, Google, Meta, and Amazon. These companies are heavily subsidizing the AI ecosystem through massive capital expenditures (CapEx). They are willingly absorbing billions of dollars in losses and extended payback periods to build the foundational infrastructure required to stay relevant. Microsoft’s multi-billion-dollar investment in OpenAI, or Google’s immense internal funding of DeepMind and the Gemini models, are strategic plays. For Big Tech, AI is an existential imperative; losing the AI race means risking their core search, cloud, and social monopolies.", "layout": "default", "editorialLayout": {"role": "body-left", "theme": "LIME", "template": "EDUCATIONAL"}}	2026-10-19 11:55:44.569	2026-10-19 11:55:44.569	\N
4f9f3f32-937d-4728-8af3-bb8111110714	ad3ae4af-e706-4dab-90c3-6c896b1a1f41	TEXT	5	{"text": "2. The Venture Capital Engine Silicon Valley venture capital firms continue to pour billions into AI startups. Companies like Anthropic, Cohere, and Mistral have raised massive war chests to fund their astronomical training runs. VCs are betting that these models will eventually become the foundational operating systems of the future economy, justifying the massive upfront cash burn.", "layout": "default", "editorialLayout": {"role": "body-right", "theme": "LIME", "template": "EDUCATIONAL"}}	2026-10-19 11:55:44.569	2026-10-19 11:55:44.569	\N
08f69737-38d4-4717-9188-7ff4d8e1cb1c	ad3ae4af-e706-4dab-90c3-6c896b1a1f41	TEXT	6	{"text": "3. Enterprise and Consumer Wallets Increasingly, the end-user is beginning to shoulder the cost. Millions of individuals pay $20 a month for premium consumer subscriptions. On a much larger scale, enterprise customers are paying heavily for API access to integrate AI into their proprietary tools. Software-as-a-Service (SaaS) companies are also passing costs down to consumers by embedding AI features into existing software and quietly raising their subscription prices.\\n\\nThe Hidden Currency: Your Prompts and Corrections While financial capital buys the capacity to learn—the chips, the servers, the electricity—it cannot buy the intelligence itself. The other half of the economic equation is data.", "layout": "default", "editorialLayout": {"role": "callout", "theme": "LIME", "template": "EDUCATIONAL"}}	2026-10-19 11:55:44.569	2026-10-19 11:55:44.569	\N
49527928-605b-406d-92de-fdbd2f10a963	ad3ae4af-e706-4dab-90c3-6c896b1a1f41	TEXT	7	{"text": "In the early days of generative AI, models were trained by scraping the vast, publicly available internet (Wikipedia, Reddit, news articles, open-source code). But the internet is a finite resource, and much of it is noisy, poorly formatted, or inaccurate. To make AI systems truly helpful, safe, and conversational, AI companies need high-quality human interactions.\\nThis is where the user becomes part of the product. When you type a prompt into an AI, you are providing a service. When you ask a complex coding question, demand a specific creative writing style, or ask the AI to solve a logistical puzzle, you are generating pristine, targeted data that no web scraper could ever find.", "layout": "default", "editorialLayout": {"role": "body-full", "theme": "LIME", "template": "EDUCATIONAL"}}	2026-10-19 11:55:44.569	2026-10-19 11:55:44.569	\N
0fa10ca6-42bd-487c-a992-aa338b623e79	d3e0aa7c-aeb1-42af-b73e-c62d06cdee0b	HEADING	0	{"text": "CMS Test Article"}	2026-08-12 22:11:26.09	2026-08-12 22:11:26.09	\N
c4c72ccc-8be3-47c2-94c6-682b9f73bd15	d3e0aa7c-aeb1-42af-b73e-c62d06cdee0b	TEXT	1	{"text": "This is a test article created from the new editorial workspace"}	2026-08-12 22:11:26.09	2026-08-12 22:11:26.09	\N
80d9d9c7-c3d1-405d-92ed-b09682b35141	b441bd88-cff7-4ee1-9de4-9363e9e097b3	HEADING	0	{"text": "optimisation"}	2026-08-12 23:54:05.547	2026-08-12 23:54:05.547	\N
c120c1d4-330d-4729-8598-33a1caa1ed84	b441bd88-cff7-4ee1-9de4-9363e9e097b3	IMAGE	1	{"layout": "full"}	2026-08-12 23:54:05.547	2026-08-12 23:54:05.547	821b2ff5-0842-444d-8a17-5dbedce5f6c1
4e5c2e93-754a-4d9d-87a6-a1c4f95d9720	7e1622c1-d569-47d6-b51d-f29fc77d3eeb	VIDEO	0	{"layout": "full"}	2026-08-13 00:33:02.567	2026-08-13 00:33:02.567	ab15b93f-98f7-4330-a1a3-c12433cb7830
1257d835-bdb9-41cb-ac2a-7636358b09df	f078b5ad-35f8-4695-a999-4e40b2ad80cf	TEXT	0	{"text": " What If Your Bank Becomes Your Gateway to Government? Is this customer service, a marketing strategy — or the beginning of a completely different relationship between citizens, banks and the state? Imagine walking into your bank. You are not there to withdraw money. You are not applying for a loan. You are not opening an investment account. You are there because you need a South African Smart ID. And instead of travelling to a Department of Home Affairs office, standing in a queue and filling out paperwork, you walk over to a digital terminal inside your bank branch, verify your identity using biometrics, complete the application and leave. A few minutes. No traditional Home Affairs queue. No paper forms. No appointment. It sounds almost far fetched. But this is already happening. And it raises a much bigger question than whether getting an ID at a bank is convenient. What happens when your bank becomes one of the places where you interact with the South African state?", "layout": "default"}	2026-09-04 09:26:49.979	2026-09-04 09:26:49.979	\N
ea4606cf-0b53-4df2-918e-0d4cbdbae139	f078b5ad-35f8-4695-a999-4e40b2ad80cf	TEXT	1	{"text": "This isn't just a Capitec story It would be easy to look at the development and conclude that Capitec has simply found another clever way to attract customers. There is certainly a commercial angle worth examining. But the reality is bigger. The Department of Home Affairs has deliberately embarked on a Digital Partnership Model with South Africa's banking sector, designed to expand access to civic services. The partnership is not brand new. Government says the broader bank relationship dates back to 2015, when Home Affairs began working with banks to use the banking sector as an additional channel for identity verification and civic services. The original participating institutions included Absa, FNB, Nedbank and Standard Bank, with other banks joining later. What changed in 2026 was the scale and technology. The old model involved banks effectively hosting small Home Affairs service points, with customers using the eHomeAffairs platform, making bookings and visiting branches mainly for biometric capture. The new model is considerably more integrated. Participating banks connect to Home Affairs through a secure digital gateway, allowing applications to be processed digitally at the branch. Home Affairs describes this as part of its broader Home Affairs @ home reform programme — essentially an attempt to move government services closer to citizens instead of forcing citizens to travel to government offices. And that changes the story completely.", "layout": "default"}	2026-09-04 09:26:49.979	2026-09-04 09:26:49.979	\N
ec91335a-642a-48ff-b25b-1db32465940d	ba494146-681e-4b00-b9af-d13382b3d0da	TEXT	0	{"text": "UNDER SIEGE The Silent Invasion: Is the Indian Myna Winning the Battle Against South Africa's Native Birds? An IMPILO Magazine Environmental Investigation By Tommy V. Fihla \\"Not every invasion arrives with armies. Some arrive with wings.\\"", "layout": "default"}	2026-09-04 09:42:47.354	2026-09-04 09:42:47.354	\N
0cb2d4d7-c446-49f3-a70b-4d4939759179	cd838ff1-d0f0-46b5-b9e3-380d14f0b179	TEXT	0	{"text": "OWN GOAL How FIFA and EA's Billion-Dollar Breakup Became a Masterclass in Business, Licensing and Intellectual Property PART I — THE BILLION-DOLLAR WHISTLE By Tommy V. Fihla \\"In football, an own goal is often remembered longer than a winning strike. In business, an own goal can reshape an entire industry.\\" For nearly thirty years, millions of football fans around the world believed they were buying FIFA every time they picked up the latest football video game. Birthdays, Christmas holidays, school tournaments and late-night gaming sessions became synonymous with one familiar name splashed across a blue cover: EA SPORTS FIFA. The title became so dominant that it transcended gaming. Parents who had never touched a console knew what \\"FIFA\\" meant. Friends invited each other over for a \\"game of FIFA,\\" not necessarily because they cared who published it, but because the brand had become part of everyday language. Like people saying they would \\"Google it\\" instead of \\"search the web,\\" the name itself became shorthand for an entire experience. Yet behind the scenes, the relationship that produced one of the most successful entertainment franchises in history was never as simple as many people imagined. One company built the game. The other licensed the name. For years, those two contributions appeared inseparable. But when the partnership finally came to an end in 2022, the world witnessed one of the most fascinating business case studies in modern entertainment. It wasn't simply the end of a licensing agreement—it was a lesson in intellectual property, negotiation, branding and the true value of innovation. Today, millions of players still enjoy the game they once called FIFA. Only now, it carries a different name: EA SPORTS FC. That raises a compelling question. If the players remained, the clubs remained, the leagues remained, the gameplay remained and the fans remained... What exactly did FIFA lose? Or perhaps an even more provocative question: Did FIFA score an own goal? This feature is not about assigning blame. Nor is it an attempt to question the legal rights of FIFA or Electronic Arts (EA). Both organisations acted within their commercial interests, and only they know the full details of their negotiations. Instead, this article explores what happened, why it matters and what entrepreneurs, creatives and innovators can learn from one of the biggest licensing breakups in gaming history. More Than Just a Video Game To understand the significance of the split, we must first appreciate what the FIFA series became over three decades. The first EA football title carrying the FIFA licence launched in 1993. At the time, football games were relatively simple. Player movements were stiff, graphics were basic and realism was limited by the technology of the era. However, EA recognised an opportunity. Rather than producing a generic football game, it partnered with FIFA, the global governing body of football, to create an officially licensed product that immediately stood apart from its competitors. The FIFA name brought authenticity. Fans could associate the game with the world's biggest football tournaments, while EA invested heavily in technology, gameplay mechanics and annual improvements. As gaming technology evolved, so did the franchise. Motion capture made players move more realistically. Artificial intelligence improved the behaviour of computer-controlled teams. Online multiplayer transformed football gaming into a global social experience. Ultimate Team became one of the most profitable modes in gaming history, creating an ecosystem where millions of players built dream squads using officially licensed footballers. Over time, the annual release of FIFA became more than a product launch. It became a global event. But hidden beneath every new edition was a network of legal agreements that most gamers never considered. The average player assumed FIFA owned everything inside the game. That assumption was understandable—but it was never entirely true. The Invisible Business Behind Every Match One of the greatest misconceptions in the gaming industry is that the organisation whose name appears on the box automatically owns everything inside it. In reality, modern entertainment products are built on layers of intellectual property. Imagine producing a blockbuster film. The studio may own the movie, but individual actors have contracts. Musicians license their soundtracks. Costume designers retain rights over original creations. Special effects companies own proprietary technology. Distribution platforms negotiate separate agreements. Every element has its own legal owner, even though audiences experience the final product as one seamless work. Football games operate in much the same way. The FIFA name represented only one part of a much larger commercial ecosystem. Electronic Arts developed the software, employed the engineers, invested in graphics technology, maintained online servers and designed gameplay systems refined over decades. Separately, it entered into licensing agreements with football leagues, clubs and player organisations that allowed many real teams, players and competitions to appear in the game. That distinction would prove crucial. When negotiations between EA and FIFA eventually broke down, EA did not lose everything. Nor did FIFA. Instead, each party walked away with the assets it actually owned. The result surprised many observers because the game that emerged after the split still looked remarkably familiar. Players could still step onto digital versions of famous stadiums. Clubs retained recognisable kits. Career Mode continued. Ultimate Team remained one of the franchise's defining experiences. Online competition continued almost uninterrupted. The biggest change was not what appeared on the screen. It was what appeared on the cover. For decades, consumers believed the FIFA logo was the product. The breakup revealed something more complicated. Perhaps the logo had become only one ingredient in a recipe that audiences valued for many different reasons. And in business, discovering which ingredient customers value most can change everything.", "layout": "default"}	2026-09-04 09:25:06.4	2026-09-04 09:25:06.4	\N
434d94a8-3cc7-4b15-a055-54b2d07dea5d	cd838ff1-d0f0-46b5-b9e3-380d14f0b179	TEXT	1	{"text": "Part I continues with: \\"The Negotiation That Changed Football Gaming Forever,\\" where we'll examine the public business context surrounding the EA–FIFA split, why licensing negotiations matter, and the first major lesson every entrepreneur should learn about partnerships. OWN GOAL How FIFA and EA's Billion-Dollar Breakup Became a Masterclass in Business, Licensing and Intellectual Property PART I (Continued) — THE NEGOTIATION THAT CHANGED FOOTBALL GAMING FOREVER When the Whistle Blew Business partnerships rarely end overnight. Long before the public announcement that FIFA and Electronic Arts would part ways, negotiations were taking place behind closed doors. Like most high-value commercial agreements, both organisations had to determine whether renewing their relationship still made strategic and financial sense. The exact details of those negotiations remain confidential, and neither party has publicly disclosed every commercial discussion. What is known is that the licensing agreement expired after FIFA 23, ending nearly three decades of one of the entertainment industry's most recognizable partnerships. For football fans, the announcement felt shocking. For business professionals, it was fascinating. One question immediately dominated conversations: Could EA survive without FIFA? Another quickly followed: Could FIFA succeed without EA? The world would soon discover that these were two very different questions.", "layout": "default"}	2026-09-04 09:25:06.4	2026-09-04 09:25:06.4	\N
b1e2567a-45aa-489f-b213-05a5dc1c4503	cd838ff1-d0f0-46b5-b9e3-380d14f0b179	TEXT	2	{"text": "A Name Worth Billions A trademark is one of the most valuable assets any organisation can own. Think about names such as Coca-Cola, Apple, Nike or Mercedes-Benz. The physical products matter. But the names themselves carry enormous commercial value because they represent years—sometimes decades—of trust, reputation and recognition. FIFA had spent almost a century building one of sport's most recognizable brands. Its tournaments captured billions of viewers. Its logo appeared in every corner of the football world. Its World Cup was arguably the biggest sporting event on Earth. Naturally, that reputation carried significant commercial value. Licensing the FIFA name to Electronic Arts was therefore not simply allowing a logo to appear on a video game. It was allowing one of the world's strongest sporting brands to become part of an entertainment product that sold tens of millions of copies. From FIFA's perspective, protecting the value of that trademark was a legitimate business objective. From EA's perspective, however, another question had become increasingly important. How much of the game's success came from the FIFA name—and how much came from the game itself? That is not a legal question. It is a strategic one.", "layout": "default"}	2026-09-04 09:25:06.4	2026-09-04 09:25:06.4	\N
aa9f23db-bfa8-4ab4-8311-5f6095582aff	cd838ff1-d0f0-46b5-b9e3-380d14f0b179	TEXT	3	{"text": "The Difference Between a Product and a Brand This distinction is one that many entrepreneurs misunderstand. A product solves a problem. A brand influences how people feel about that product. The two are related. They are not the same. Imagine buying a luxury watch. The craftsmanship matters. The reliability matters. The materials matter. But so does the logo on the dial. Now imagine removing the logo. Would the watch suddenly stop keeping time? Of course not. The engineering remains exactly the same. However, the perceived value may change because branding influences customer perception. The FIFA–EA story challenges us to ask whether consumers were buying the logo—or whether they had developed loyalty to the experience Electronic Arts had spent decades creating. The answer appears to be more complex than many expected.", "layout": "default"}	2026-09-04 09:25:06.4	2026-09-04 09:25:06.4	\N
e4e8c3b4-ac6d-4686-ac1f-8bd78dbc0332	cd838ff1-d0f0-46b5-b9e3-380d14f0b179	TEXT	4	{"text": "Building Something Bigger Than a Licence For years, Electronic Arts invested in assets that extended far beyond a single licensing agreement. It built game engines capable of delivering increasingly realistic football. It hired thousands of developers, artists, engineers, sound designers and producers. It invested in online infrastructure capable of supporting millions of simultaneous players. It developed anti-cheat systems. It refined artificial intelligence. It created Ultimate Team, Career Mode, Pro Clubs and other gameplay experiences that encouraged players to return year after year. None of these innovations depended solely on the FIFA trademark. They were the result of continuous investment in technology and product development. This illustrates one of the most important principles in business: Never build a company that depends entirely on an asset you do not own. Many startups make this mistake. Some rely completely on a single supplier. Others depend on one large client. Some build businesses entirely around one social media platform. Others assume a partnership will last forever. History repeatedly shows that circumstances change. Companies that survive are those that continue investing in capabilities they own and control. Electronic Arts appears to have followed that philosophy by strengthening relationships across the wider football ecosystem rather than relying exclusively on one licensing agreement.", "layout": "default"}	2026-09-04 09:25:06.4	2026-09-04 09:25:06.4	\N
74a157c8-9116-4d5a-8af3-d29ad6f4d7c5	cd838ff1-d0f0-46b5-b9e3-380d14f0b179	TEXT	5	{"text": "Partnerships Are About Shared Value The word \\"partnership\\" is often used casually. People say, \\"We're partners.\\" But genuine business partnerships are built upon reciprocal value. Each party contributes something the other needs. One partner might contribute technology. Another contributes distribution. Another provides financing. Another offers expertise. Another supplies intellectual property. Healthy partnerships recognise that each contribution deserves respect. Problems can emerge when either side begins believing the relationship depends primarily—or exclusively—on its own contribution. That observation is not unique to football. It applies to publishing. Fashion. Film. Photography. Music. Software. Television. Even small businesses. Successful partnerships ask one simple question: If this relationship ended tomorrow, what could each side still take with them? The answer often reveals where the real value lies.", "layout": "default"}	2026-09-04 09:25:06.4	2026-09-04 09:25:06.4	\N
3a9fa1bf-10a3-4015-8adc-b7e25621bb28	cd838ff1-d0f0-46b5-b9e3-380d14f0b179	TEXT	6	{"text": "The Creative Industry's Hidden Weakness This is where many creatives unknowingly expose themselves to enormous risk. Photographers sometimes surrender all image rights without understanding the consequences. Musicians sign contracts transferring ownership of their master recordings. Software developers create platforms while assigning complete ownership to clients. Graphic designers deliver original artwork without negotiating future licensing terms. Content creators produce videos that", "layout": "default"}	2026-09-04 09:25:06.4	2026-09-04 09:25:06.4	\N
a5af7816-42e2-4018-9de8-61dad78882e5	98bf1363-e317-46d7-ae6b-bdb356488712	TEXT	7	{"text": "IMPILO Field Notes The most valuable evidence in environmental journalism is often the evidence gathered firsthand. The photographs and videos accompanying this investigation were captured while observing Indian Mynas in an urban South African environment. Rather than behaving cautiously, the birds displayed remarkable confidence around people and repeatedly displaced smaller birds from feeding and resting areas. Although one observation alone cannot prove long-term ecological change, it reflects behaviour that has also been documented in scientific studies of the species. Sometimes the first indication that an ecosystem is changing is not found in a laboratory. It is noticed by ordinary people paying attention to the world around them.", "layout": "default"}	2026-09-14 15:06:29.184	2026-09-14 15:06:29.184	\N
b21c0084-f20a-4f3d-88b4-235a8e90c624	98bf1363-e317-46d7-ae6b-bdb356488712	TEXT	8	{"text": "Coming Next in Part II In the next chapter, IMPILO investigates whether South Africa could follow Botswana's path if the spread of Indian Mynas continues. We'll examine the provinces where the birds are now firmly established, the science behind their ecological impact, whether current management efforts are enough, and what every South African can do to help protect indigenous birdlife before today's quiet invasion becomes tomorrow's environmental crisis.", "layout": "default"}	2026-09-14 15:06:29.184	2026-09-14 15:06:29.184	\N
4683a896-3a7d-467b-9335-3615020b38b7	f078b5ad-35f8-4695-a999-4e40b2ad80cf	TEXT	2	{"text": "From 30 branches to hundreds The scale of the expansion is perhaps the most remarkable part. Before the new digital partnership went live in March 2026, only about 30 bank branches were part of the older Home Affairs partnership model. Within weeks, that number exploded. By 1 April, Home Affairs reported that 110 bank branches were already live: 77 Capitec branches, 30 Standard Bank branches and three FNB branches. By mid-May, the department reported 167 participating branches. By July, the figure had reached 327. Together with 214 modernised Home Affairs offices, that meant South Africans could access Smart ID services at 541 locations — compared with 214 Home Affairs locations before the expansion. And the government has set an even larger target. The intention is to reach approximately 750 participating bank branches by the end of 2026. The longer-term Medium-Term Development Plan target is 1,000 participating bank branches by 2029. That is no longer a side project. It is becoming part of the country's civic infrastructure.", "layout": "default"}	2026-09-04 09:26:49.979	2026-09-04 09:26:49.979	\N
ce1ebfa4-f4ae-4fa4-bd22-7b78b6e048f2	f078b5ad-35f8-4695-a999-4e40b2ad80cf	TEXT	3	{"text": "Five minutes instead of an entire day The attraction is obvious. Home Affairs says the new digital process can allow a Smart ID replacement application to be completed in as little as five minutes. There is no paperwork. No prior booking is required at participating branches. Biometric technology is used to verify the applicant. The system is digitally integrated with Home Affairs. For someone who has ever lost an entire working day trying to deal with government administration, that is not a minor improvement. It can mean less transport expenditure. Less time away from work. Less time standing in a queue. Less pressure on Home Affairs offices. And potentially better access for people living far from traditional government service points. Home Affairs has explicitly described the reform as an effort to bring services closer to communities, including rural and underserved areas. So if someone asks whether this is good customer service, the answer is simple: Yes. But that is only half the story.", "layout": "default"}	2026-09-04 09:26:49.979	2026-09-04 09:26:49.979	\N
f4459f12-1d33-42af-832f-4bf81883966b	f078b5ad-35f8-4695-a999-4e40b2ad80cf	TEXT	4	{"text": "Follow the customer Now put on the business hat. Banks are competing for customers in one of South Africa's most competitive industries. A bank can compete on transaction fees. It can compete on interest rates. It can compete on technology. It can compete on customer service. And increasingly, it can compete on how many everyday problems it can solve. That is where the Smart ID service becomes strategically interesting. Imagine two banks. Bank A says: “We offer low fees and a great banking app.” Bank B says: “We offer low fees, a great app, and you can also access Home Affairs services at our branches.” Which one sounds more useful? The second bank has potentially created another reason for you to walk through its doors. And every additional reason to interact with a financial institution can strengthen the relationship between customer and bank. That doesn't mean the service is a scam. It doesn't mean Capitec is doing anything wrong. It means commercial incentives and public benefit can exist at the same time. That is what makes the story interesting.", "layout": "default"}	2026-09-04 09:26:49.979	2026-09-04 09:26:49.979	\N
03b2a9f2-17e6-4c90-b9a9-baaa5098aad4	f078b5ad-35f8-4695-a999-4e40b2ad80cf	TEXT	5	{"text": "The Capitec question Capitec was one of the first banks to go live under the new digital model. Its Smart ID service uses dedicated Self-Service Terminals inside participating branches. The bank says customers can complete a paperless application in less than five minutes, with the application integrated with Home Affairs systems. But here is where consumers need to pay attention. The government announcement in August 2025 said that any South African, including people who were not Capitec customers, would be able to access the service at selected Capitec branches. The service subsequently launched in phases. That means people should not assume that every Capitec branch offers the service or that the eligibility rules are identical across every phase of the rollout. The safest approach is to check the current requirements and participating branch before travelling. The broader principle remains important: A government identity document is a public service. The bank is the access channel, not the issuer of the identity document. Home Affairs remains responsible for the official identity system.", "layout": "default"}	2026-09-04 09:26:49.979	2026-09-04 09:26:49.979	\N
8d1ba01a-6aba-4eb0-80a5-41a33cc86522	f078b5ad-35f8-4695-a999-4e40b2ad80cf	TEXT	6	{"text": "Your bank does not issue your ID This distinction matters. When someone says: “Capitec gives you an ID.” That is technically incorrect. Capitec provides the access point and technology for the application. The Department of Home Affairs remains the government authority responsible for the identity document. The bank's systems communicate securely with Home Affairs systems, while biometric verification helps confirm the applicant's identity. The physical Smart ID remains a Home Affairs document. This may sound like semantics. It isn't. It tells us where the power actually sits. The bank is becoming the interface. The state remains the authority. And that relationship is going to become increasingly important as more government services move into digital platforms.", "layout": "default"}	2026-09-04 09:26:49.979	2026-09-04 09:26:49.979	\N
08fced77-759f-438c-97f3-640d82275e83	f078b5ad-35f8-4695-a999-4e40b2ad80cf	TEXT	7	{"text": "What happens to your data? Now we arrive at the uncomfortable question. Biometrics. Your fingerprints. Your photograph. Your identity number. Your personal information. These are not ordinary pieces of data. They are connected to your identity. The new bank-based system relies heavily on biometric verification and secure digital connections between the bank environment and Home Affairs systems. That makes the technology powerful. But whenever powerful identity technology expands, privacy and cybersecurity have to expand alongside it. Citizens should reasonably want to know: Who captures the information? Where is it stored? Who can access it? Does the bank retain the biometric information? What information is transmitted to Home Affairs? How long is information retained? What happens if there is a cybersecurity incident? What happens if the bank's systems are compromised? What happens if a biometric system incorrectly identifies someone? These are not anti-technology questions. They are pro-trust questions. South Africa cannot build a digital identity ecosystem successfully unless citizens trust the institutions operating it. The President has already said that citizen protections and rights need to be safeguarded as government services undergo this digital transformation.", "layout": "default"}	2026-09-04 09:26:49.979	2026-09-04 09:26:49.979	\N
4c4bfc40-a252-4704-b6f2-4731c49d7728	98bf1363-e317-46d7-ae6b-bdb356488712	QUOTE	0	{"text": "UNDER SIEGE The Silent Invasion: Is the Indian Myna Winning the Battle Against South Africa's Native Birds? An IMPILO Magazine Environmental Investigation By Tommy V. Fihla \\"Not every invasion arrives with armies. Some arrive with wings.\\""}	2026-09-14 15:06:29.184	2026-09-14 15:06:29.184	\N
804ad5e4-d1a8-4190-a16f-858d4afdfa8f	f078b5ad-35f8-4695-a999-4e40b2ad80cf	TEXT	8	{"text": "And this is where things get really interesting The Smart ID may only be the beginning. Home Affairs has said the digital partnership is expected to expand beyond Smart ID replacement services. The department has announced plans to introduce: first-time Smart ID applications; passport applications; passport and ID services through banking apps; home delivery of identity documents; broader digital identity services. Home Affairs has said these capabilities are being rolled out in phases during 2026. Now imagine the full ecosystem. You open your banking app. You transfer money. You buy electricity. You pay your accounts. You verify your identity. You apply for a government document. You receive notification that it is ready. Eventually, you may even have a government-issued digital identity on your phone. Suddenly, the bank is no longer merely a financial institution. It is part of the digital gateway through which citizens access the state. That is the far-fetched part. And yet it is already being built.", "layout": "default"}	2026-09-04 09:26:49.979	2026-09-04 09:26:49.979	\N
4e58293b-360a-462d-a60f-28cdf6f68c60	f078b5ad-35f8-4695-a999-4e40b2ad80cf	TEXT	9	{"text": "The bank branch becomes something else For generations, the bank branch had a very specific purpose. You went there because you needed money. Then ATMs changed that. Then internet banking changed it again. Then mobile banking changed it further. The smartphone turned the bank into something you carry in your pocket. Now the physical branch may be evolving once again. It could become a place where people access a collection of trusted digital services — financial, commercial and governmental. That could fundamentally change the economics of the branch. Why maintain a physical branch if customers only need banking services through an app? Because the branch could become something else. A trusted physical location for identity verification. Biometrics. Government services. Complex financial services. Digital onboarding. Customer support. And perhaps services we haven't even imagined yet. The bank branch could become less of a cash centre and more of a trusted identity and service centre.", "layout": "default"}	2026-09-04 09:26:49.979	2026-09-04 09:26:49.979	\N
84bbaac7-c5e3-4e36-9b2a-45448d3dc523	f078b5ad-35f8-4695-a999-4e40b2ad80cf	TEXT	10	{"text": "Is this good for South Africa? Potentially, very much so. South Africa has a major infrastructure advantage that many countries would envy. The banking sector already has an extensive network of branches, digital platforms, security systems and established customer relationships. Government has the legal authority and national databases required to provide official civic services. Connecting the two can dramatically increase access. Home Affairs says more than 400 bank branches were offering Smart ID replacement services by August 2026, and more than half a million Smart ID applications had already been processed through participating bank branches by early August. Those numbers suggest that South Africans are not merely curious about the system. They are using it. And that matters.", "layout": "default"}	2026-09-04 09:26:49.979	2026-09-04 09:26:49.979	\N
c753c4ed-e25e-4433-87f9-48489a624848	f078b5ad-35f8-4695-a999-4e40b2ad80cf	TEXT	11	{"text": "But convenience must not become dependency There is, however, a line South Africa must be careful not to cross. If government services become increasingly dependent on commercial infrastructure, citizens must not lose meaningful choice. A person who does not bank with Capitec should not effectively become a second-class citizen. Someone who does not have a bank account should not be excluded from essential government services. Someone who lives far from a participating branch should not be forgotten. And someone who chooses not to use digital technology should still have appropriate access to government services. The bank partnership should therefore expand access, not quietly redefine access. Home Affairs has made clear that its own offices and mobile offices remain part of the service network. That is important. Banks should be additional doors. They should not become the only doors.", "layout": "default"}	2026-09-04 09:26:49.979	2026-09-04 09:26:49.979	\N
c471ae5a-db97-42cf-9513-ee5dd570f6c4	f078b5ad-35f8-4695-a999-4e40b2ad80cf	TEXT	12	{"text": "So, is it a marketing ploy? Here's our answer: Yes. And no. It is undeniably useful to customers. It is also undeniably useful to banks. A bank that can solve more of your everyday problems has a competitive advantage. But calling the entire project a marketing gimmick would miss the much larger transformation taking place. This is a government reform programme using private-sector infrastructure to solve a public-service problem. And the banks have every reason to participate. They gain customer engagement. Government gains additional service points. Citizens gain convenience. If the system is properly governed, everyone can benefit. The real test is not whether Capitec benefits commercially. Of course it can. The real test is: Does the citizen benefit without sacrificing choice, privacy, security or equal access? That is the question regulators, government, banks and citizens should keep asking.", "layout": "default"}	2026-09-04 09:26:49.979	2026-09-04 09:26:49.979	\N
793f5292-1e0e-448b-821d-82c956b7f61f	f078b5ad-35f8-4695-a999-4e40b2ad80cf	TEXT	13	{"text": "The future may be closer than we think The most interesting part of this story is not the ID terminal sitting inside a bank. It is what happens after that. Today: Bank → Smart ID application. Tomorrow: Bank app → Government service. Eventually: Phone → Digital identity → Government services. South Africa is already moving towards a digital identity ecosystem in which citizens could securely verify themselves remotely and access digital versions of official documents. The government's broader digital-transformation programme also envisages more public services being delivered digitally rather than requiring citizens to visit government offices. At that point, the traditional boundary between banking technology and government technology becomes much less obvious. And perhaps that is the real story. We started by asking: Is Capitec's Smart ID service customer service or a marketing ploy? Maybe we are asking the wrong question. The bigger question is: What happens when the place where you manage your money becomes one of the places where you manage your identity? That is no longer far fetched. It is already happening.", "layout": "default"}	2026-09-04 09:26:49.979	2026-09-04 09:26:49.979	\N
2873212e-cd0e-4b6b-9294-18a8c6115a0b	f078b5ad-35f8-4695-a999-4e40b2ad80cf	TEXT	14	{"text": "IMPILO EDITORIAL VIEW The convenience is real. The commercial incentive is real. The technological transformation is real. But so are the questions about privacy, accessibility, competition and the role of private companies in delivering public services. South Africa should embrace innovation that makes government services faster and more dignified. At the same time, citizens should demand transparency about how their personal and biometric information is handled and should retain meaningful alternatives for accessing essential government services. The future of public service may not belong entirely to government buildings. It may be distributed across banks, smartphones, digital platforms and eventually our digital identities. The challenge will be making sure that the future is not only convenient. It must also be secure, inclusive and fair.", "layout": "default"}	2026-09-04 09:26:49.979	2026-09-04 09:26:49.979	\N
f3e8a0d9-4f56-482b-a6a2-b44ffc6483ed	f078b5ad-35f8-4695-a999-4e40b2ad80cf	TEXT	15	{"text": "SOURCES & FACT CHECK This article is based primarily on official statements and information from the South African Department of Home Affairs and South African Government, including announcements on the Digital Partnership Model, participating bank branches, Smart ID services and the government's wider Home Affairs @ home programme. Readers should verify current participating branches, eligibility requirements, application services and processing information before visiting a branch, as the programme is being rolled out in phases and service availability can change. Important: The participating banks provide an access and technology channel for Home Affairs services. They do not become the issuing authority for South African identity documents. The Department of Home Affairs remains responsible for the official identity system. SAFETY, PRIVACY & EDITORIAL DISCLAIMER This article is an editorial and informational analysis. It is not legal, financial or government-service advice. IMPILO Magazine does not represent the Department of Home Affairs or any participating bank. Information about branch availability, eligibility, fees, processing times and services may change. Readers should confirm requirements directly with the Department of Home Affairs or the relevant participating bank before travelling or submitting an application. Where biometric and personal information is involved, readers should ensure they understand the relevant privacy notices, consent requirements and data-processing arrangements applicable to the service they use. Sources: South African Government / Department of Home Affairs, 2025–2026 official announcements and statements on the banking Digital Partnership Model, Smart ID services and Home Affairs @ home. Why I think this is the stronger IMPILO version This is now well above 700 words, but more importantly, it has several layers rather than simply repeating “banks can issue IDs.” The factual backbone is quite strong: the programme began as an older bank/Home Affairs relationship, the new digital model went live in March 2026, it expanded from 30 legacy bank branches to hundreds, and government is targeting 750 branches in 2026 and 1,000 by 2029. It also corrects the potentially dangerous misconception that “Capitec issues your ID.” It doesn't. The bank provides the access technology; Home Affairs remains the government authority. And I deliberately made the privacy section substantial. That's where I think IMPILO can distinguish itself from clickbait sites: don't just tell readers “you can get an ID at the bank.” Explain how the system changes the relationship between citizens, banks, government, biometrics and digital identity. SEO focus keyphrase: bank Smart ID South Africa Secondary keywords: Capitec Smart ID, Home Affairs bank partnership, Smart ID at bank, South Africa digital identity, Home Affairs digital partnership, banking and government services, Smart ID replacement Suggested SEO title: Your Bank Is Becoming a Gateway to Government — Here's What That Means Meta description: South Africa's banks are becoming access points for Home Affairs services. Is it convenience, customer acquisition or the future of digital government? And the hook you selected should stay at the very top of the page: “What if your bank isn't just where you keep your money anymore — but where you go to deal with government?” That is the Far Fetched hook.", "layout": "default"}	2026-09-04 09:26:49.979	2026-09-04 09:26:49.979	\N
91ab9e34-1612-410a-a696-13e1f3508ee8	ba494146-681e-4b00-b9af-d13382b3d0da	TEXT	1	{"text": "They Were Everywhere At first, they seemed ordinary. A few brown birds gathered on a rooftop outside a shopping centre. Others perched on streetlights, walked fearlessly between parked cars and scavenged for food near outdoor restaurants. Unlike many indigenous birds that quickly disappear when people approach, these birds appeared remarkably confident. They were noisy, energetic and completely at home in the middle of the city. Then something changed. As I continued photographing and filming them, I noticed behaviour that was impossible to ignore. Whenever smaller birds approached nearby trees or feeding areas, the newcomers reacted aggressively. Instead of tolerating the presence of native birds, they chased them relentlessly. Sometimes one bird would initiate the attack. Other times, several appeared to join in, forcing the smaller birds to retreat. Within moments, the indigenous birds had disappeared. The newcomers remained. That observation prompted an important question. Were these birds simply defending their territory, or was something far more significant happening in South Africa's urban ecosystems? The answer led to one of the world's most successful—and controversial—invasive bird species: the Common Myna, better known in southern Africa as the Indian Myna.", "layout": "default"}	2026-09-04 09:42:47.354	2026-09-04 09:42:47.354	\N
97a80b63-02dc-454e-9bef-ae0ced7319b6	ba494146-681e-4b00-b9af-d13382b3d0da	TEXT	2	{"text": "A Visitor That Never Left The Indian Myna (Acridotheres tristis) is native to the Indian subcontinent, where it forms part of the natural ecosystem. In India, Pakistan, Bangladesh and Nepal, the species evolved alongside native predators, competitors and environmental conditions over thousands of years. In many farming communities it is even appreciated because it feeds on insects that damage crops. Southern Africa is a different story. Historical records indicate that Indian Mynas became established in South Africa after birds escaped from captivity in Durban in the early 1900s. What began as a small population eventually expanded through towns and cities, taking advantage of an environment that offered abundant food, nesting opportunities and relatively few natural barriers. More than a century later, the species has spread across much of South Africa and into neighbouring countries, including Botswana. Unlike migratory birds that arrive and leave with the seasons, the Indian Myna has become a permanent resident. The question is no longer whether it belongs here. The question is what its long-term presence means for the birds that already did.", "layout": "default"}	2026-09-04 09:42:47.354	2026-09-04 09:42:47.354	\N
93c0597a-b067-48a0-81c7-3dbec8cf9b5c	ba494146-681e-4b00-b9af-d13382b3d0da	TEXT	3	{"text": "The Perfect Urban Survivor Many invasive species fail because they cannot adapt to unfamiliar environments. The Indian Myna succeeded because it possesses an extraordinary combination of characteristics. It is intelligent. It is highly adaptable. It eats almost anything. It nests almost anywhere. It breeds quickly. Most importantly, it has learned to thrive alongside people. While many indigenous birds depend on specific habitats, the Indian Myna has turned human development into an advantage. Shopping centres become feeding grounds. Traffic lights become lookout posts. Roofs become nesting sites. Power poles become observation towers. Public parks become breeding territories. Every new suburb potentially creates another opportunity for expansion. Scientists often describe this type of species as an urban exploiter—an animal that benefits directly from human activity instead of being displaced by it. Unfortunately, that same adaptability creates increasing pressure on indigenous wildlife.", "layout": "default"}	2026-09-04 09:42:47.354	2026-09-04 09:42:47.354	\N
a4023a4e-c996-448e-bc35-1a6e5d25c77f	ba494146-681e-4b00-b9af-d13382b3d0da	TEXT	4	{"text": "The Urban Bully Perhaps the Indian Myna's most controversial characteristic is not its appearance. It is its behaviour. Researchers across several countries have documented that Common Mynas aggressively defend feeding areas and nesting cavities against other bird species. During breeding season, this behaviour becomes even more pronounced. Birdwatchers frequently report seeing several mynas pursuing a single smaller bird through gardens, parks and suburban streets. My own observations reflected this pattern. While documenting birds for this investigation, I repeatedly watched Indian Mynas pursue much smaller indigenous birds away from trees and feeding locations. Whether defending territory or competing for resources, the outcome was always the same. The indigenous birds left. The mynas stayed. Scientists refer to this type of behaviour as aggressive territorial competition. It does not necessarily involve killing other birds. Instead, repeated harassment can prevent native species from accessing food, securing nesting sites or successfully raising their young. In ecology, survival is often determined not by strength alone, but by access to resources. If one species consistently controls those resources, others gradually begin to disappear from the same environment.", "layout": "default"}	2026-09-04 09:42:47.354	2026-09-04 09:42:47.354	\N
75e9ef51-ab30-4f0b-a59e-bd55ce32f21c	ba494146-681e-4b00-b9af-d13382b3d0da	TEXT	5	{"text": "More Than Just Another Bird Some readers may wonder why this matters. After all, cities are full of birds. Does it really matter which species occupies our parks and neighbourhoods? The answer is yes. Every indigenous bird performs ecological functions developed over thousands of years. Some pollinate flowering plants. Others disperse seeds across forests and grasslands. Many naturally regulate insect populations. Predatory birds help maintain healthy food webs. Together they form an ecological network that keeps urban and natural environments functioning. When invasive species begin replacing native species, those relationships can change in ways that are not immediately obvious. The loss of a single bird species is rarely an isolated event. It can trigger a chain reaction that affects insects, plants and even other animals. Ecologists describe this as an imbalance within the ecosystem. Nature depends upon diversity. The fewer native species remain, the more fragile that balance becomes.", "layout": "default"}	2026-09-04 09:42:47.354	2026-09-04 09:42:47.354	\N
ead8dcb0-a32a-4e37-acb3-cfcf4b42d86d	ba494146-681e-4b00-b9af-d13382b3d0da	TEXT	6	{"text": "A Warning from Botswana South Africans do not have to look far to understand what can happen when an invasive species spreads largely unchecked. Across the border, Botswana has become increasingly concerned about the expansion of Indian Myna populations, particularly around urban centres such as Gaborone, Lobatse, Kanye and Jwaneng. Conservationists there have documented the species' continued spread and raised concerns about its aggressive competition with indigenous birds for nesting sites and food. While research continues into the full ecological impact, the trend has been significant enough to attract attention from bird conservation organisations and environmental authorities. Botswana's experience serves as a warning rather than a prediction. It demonstrates how quickly an adaptable invasive species can establish itself once suitable habitat becomes available. The lesson for South Africa is simple. Waiting until the problem becomes overwhelming is far more difficult than recognising the warning signs early.", "layout": "default"}	2026-09-04 09:42:47.354	2026-09-04 09:42:47.354	\N
3b570206-560f-49a3-a924-beb1d02dfba5	ba494146-681e-4b00-b9af-d13382b3d0da	TEXT	7	{"text": "IMPILO Field Notes The most valuable evidence in environmental journalism is often the evidence gathered firsthand. The photographs and videos accompanying this investigation were captured while observing Indian Mynas in an urban South African environment. Rather than behaving cautiously, the birds displayed remarkable confidence around people and repeatedly displaced smaller birds from feeding and resting areas. Although one observation alone cannot prove long-term ecological change, it reflects behaviour that has also been documented in scientific studies of the species. Sometimes the first indication that an ecosystem is changing is not found in a laboratory. It is noticed by ordinary people paying attention to the world around them.", "layout": "default"}	2026-09-04 09:42:47.354	2026-09-04 09:42:47.354	\N
ecb691fe-8bec-46c9-9712-247039c516e9	ba494146-681e-4b00-b9af-d13382b3d0da	TEXT	8	{"text": "Coming Next in Part II In the next chapter, IMPILO investigates whether South Africa could follow Botswana's path if the spread of Indian Mynas continues. We'll examine the provinces where the birds are now firmly established, the science behind their ecological impact, whether current management efforts are enough, and what every South African can do to help protect indigenous birdlife before today's quiet invasion becomes tomorrow's environmental crisis.", "layout": "default"}	2026-09-04 09:42:47.354	2026-09-04 09:42:47.354	\N
f3edb013-64cd-4c45-8c5e-efcb180e293c	b8e83af3-54c3-46b9-b0bf-ee4a9f5924cf	HEADING	0	{"text": "A Platform for the Next Generation of Talent", "editorialLayout": {"role": "section-heading", "theme": "NEUTRAL", "template": "EDITORIAL_FEATURE"}}	2026-10-21 10:35:32.566	2026-10-21 10:35:32.566	\N
e2f58efc-39f5-41ce-bc01-6352157fb15a	b8e83af3-54c3-46b9-b0bf-ee4a9f5924cf	QUOTE	1	{"text": "There was a time when being featured in a magazine meant waiting for a photographer to capture the right image, an editor to write the right words and a printed issue to eventually reach the reader. The magazine was the destination.", "editorialLayout": {"role": "pull-quote", "theme": "NEUTRAL", "variant": "QUOTE", "template": "EDITORIAL_FEATURE"}}	2026-10-21 10:35:32.566	2026-10-21 10:35:32.566	\N
630827da-7b67-48b4-a980-898872aa45bb	b8e83af3-54c3-46b9-b0bf-ee4a9f5924cf	TEXT	2	{"text": "That shift is creating a new kind of showbiz — and it is precisely the space where IMPILO Magazine is beginning to position itself.\\nThat model is changing. Today, audiences do not simply consume stories. They follow personalities, discover brands, watch performances, explore portfolios, comment on conversations, share moments and move between platforms without thinking about where one medium ends and another begins.", "editorialLayout": {"role": "eyebrow", "theme": "NEUTRAL", "template": "EDITORIAL_FEATURE"}}	2026-10-21 10:35:32.566	2026-10-21 10:35:32.566	\N
c558f1cf-ebd1-49dd-ab05-62822a30e3c2	b8e83af3-54c3-46b9-b0bf-ee4a9f5924cf	TEXT	3	{"text": "The Magazine Is No Longer Just the Magazine, the next generation of entertainment audiences does not necessarily separate a magazine article from a video, a social post, a podcast or a portfolio.\\nA fashion story can introduce a designer. The designer can appear in a photoshoot. The photoshoot can become a video. The video can become a short-form social clip. The article can lead readers to a catalogue profile. And the audience that discovers the story can eventually become part of the community surrounding the publication.", "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "variant": "PARAGRAPH", "template": "EDITORIAL_FEATURE"}}	2026-10-21 10:35:32.566	2026-10-21 10:35:32.566	\N
ac56dc71-2b36-4b72-8ace-6ff2e8536365	b8e83af3-54c3-46b9-b0bf-ee4a9f5924cf	TEXT	4	{"text": "This creates something much more powerful than a traditional article. It creates an ecosystem around the story, that is where IMPILO's emerging showbiz direction becomes interesting. Rather than treating entertainment as simply celebrity news, the platform can treat showbiz as the intersection of people, fashion, culture, creativity, business and media.", "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "template": "EDITORIAL_FEATURE"}}	2026-10-21 10:35:32.566	2026-10-21 10:35:32.566	\N
b298530c-dc52-446e-ab72-eab01f6d3ebe	b8e83af3-54c3-46b9-b0bf-ee4a9f5924cf	TEXT	5	{"text": "One of the most interesting opportunities for IMPILO is the ability to put emerging talent alongside established creative voices, models, designers, photographers, actors, musicians, presenters, entrepreneurs and digital creators increasingly build their careers through multiple platforms. Their identities are no longer contained within a single profession.\\nA model may also be a content creator. A designer may also be a storyteller. A photographer may also be a filmmaker. A musician may also be a fashion personality. A young entrepreneur may become a media personality through the story of building their company.", "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "template": "EDITORIAL_FEATURE"}}	2026-10-21 10:35:32.566	2026-10-21 10:35:32.566	\N
186ba8a6-63b7-433b-a608-516095530071	b8e83af3-54c3-46b9-b0bf-ee4a9f5924cf	TEXT	6	{"text": "IMPILO can sit in the middle of all of those worlds.The existing Impilo Catalogue points in this direction by bringing together designers, brands and creatives and giving them a structured presence beyond a single magazine feature.\\nThat changes the role of the publication. IMPILO is not simply saying, \\"Here is a person we featured.\\" It can increasingly say: \\"Here is a person. Here is their story. Here is their work. Here is their visual identity. Here is what they are building. And here is where you can discover more.\\"", "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "template": "EDITORIAL_FEATURE"}}	2026-10-21 10:35:32.566	2026-10-21 10:35:32.566	\N
bb9f1385-bf15-4c4f-ba11-7a0e3be2bf3b	b8e83af3-54c3-46b9-b0bf-ee4a9f5924cf	HEADING	7	{"text": "The Rise of Interactive Showbiz", "editorialLayout": {"role": "section-heading", "theme": "NEUTRAL", "template": "EDITORIAL_FEATURE"}}	2026-10-21 10:35:32.566	2026-10-21 10:35:32.566	\N
7651ecb5-ce10-4e7c-9608-e26f99d50edf	b8e83af3-54c3-46b9-b0bf-ee4a9f5924cf	TEXT	8	{"text": "The future of entertainment publishing is also becoming more interactive.\\nImagine reading an IMPILO feature about a designer and encountering a short video interview inside the story. Then imagine discovering a quiz about the collection, viewing the designer's catalogue profile, watching a behind-the-scenes clip from the photoshoot or joining the conversation through comments., the article stops being a static destination and becomes an experience.\\nFor IMPILO, that opens the door to a form of editorial storytelling that sits somewhere between a magazine, entertainment platform, creative directory and digital community.", "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "template": "EDITORIAL_FEATURE"}}	2026-10-21 10:35:32.566	2026-10-21 10:35:32.566	\N
620310ef-78e7-4ab6-b7c6-a7827d28ab7e	b8e83af3-54c3-46b9-b0bf-ee4a9f5924cf	HEADING	9	{"text": "From Cover Stories to Cover Over", "editorialLayout": {"role": "section-heading", "theme": "NEUTRAL", "template": "EDITORIAL_FEATURE"}}	2026-10-21 10:35:32.566	2026-10-21 10:35:32.566	\N
409d64d8-a643-4222-9a7a-1f52c11c61cf	b8e83af3-54c3-46b9-b0bf-ee4a9f5924cf	TEXT	10	{"text": "This evolution also gives new meaning to IMPILO's Cover Over concept.\\nA magazine can be read,  but it can also be discussed, it can be performed, it can be reviewed, it can be turned into a conversation, it can become video, or can become an episode.\\nInstead of simply publishing an issue and moving on to the next one, IMPILO can keep the issue alive through episodes, interviews, reactions, behind-the-scenes material and conversations around the stories.\\nThe magazine becomes the source material. The show becomes another layer. The audience becomes part of the experience. And the archive becomes increasingly valuable over time.", "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "template": "EDITORIAL_FEATURE"}}	2026-10-21 10:35:32.566	2026-10-21 10:35:32.566	\N
65a7fd45-14e4-450e-bbb7-c3e39bb57e77	b8e83af3-54c3-46b9-b0bf-ee4a9f5924cf	HEADING	11	{"text": "Why This Matters for African Creative Culture", "editorialLayout": {"role": "section-heading", "theme": "NEUTRAL", "template": "EDITORIAL_FEATURE"}}	2026-10-21 10:35:32.566	2026-10-21 10:35:32.566	\N
6b586e2e-b5e2-48b3-979b-9f6b1cfc0180	b8e83af3-54c3-46b9-b0bf-ee4a9f5924cf	TEXT	12	{"text": "There is also a bigger cultural opportunity here. Africa's creative industries are filled with stories that deserve more than a single photograph and a short caption.\\nThere are designers building brands, models building careers, photographers developing distinctive visual languages, musicians creating new sounds, actors and presenters developing new identities, entrepreneurs creating businesses around culture and digital creators building audiences without traditional media infrastructure.\\nThe challenge is often not a lack of talent,  it is discoverability.\\nA platform like IMPILO can help solve part of that problem by connecting editorial storytelling with a structured catalogue of the people and brands behind the stories.", "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "template": "EDITORIAL_FEATURE"}}	2026-10-21 10:35:32.566	2026-10-21 10:35:32.566	\N
6e037c69-7f19-4972-b567-49709311eedd	b8e83af3-54c3-46b9-b0bf-ee4a9f5924cf	HEADING	13	{"text": "The New Showbiz Is an Ecosystem", "editorialLayout": {"role": "section-heading", "theme": "NEUTRAL", "template": "EDITORIAL_FEATURE"}}	2026-10-21 10:35:32.566	2026-10-21 10:35:32.566	\N
180b1239-f2f6-4bec-8469-8e522d58d0a5	b8e83af3-54c3-46b9-b0bf-ee4a9f5924cf	TEXT	14	{"text": "The old showbiz model was built around stars. The emerging model is built around communities of creativity.\\nPeople discover someone through a photograph, follow them through a video, read their story, explore their work and eventually become part of their audience.\\nThat creates a different kind of relationship between media and talent. And it creates a different relationship between the reader and the magazine.\\nIMPILO is developing the pieces required for that transition: editorial content, visual storytelling, creative profiles, a catalogue of designers and brands, events and digital experiences. The opportunity now is to connect those pieces.\\nThe result could be something that does not fit neatly into the old categories. Not quite a traditional magazine. Not quite a television show. Not simply a catalogue. Not simply social media.", "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "template": "EDITORIAL_FEATURE"}}	2026-10-21 10:35:32.566	2026-10-21 10:35:32.566	\N
3713691f-f5c5-418a-b9f1-40a928eea957	b8e83af3-54c3-46b9-b0bf-ee4a9f5924cf	TEXT	15	{"text": "Instead, a living creative platform where the magazine becomes the heartbeat connecting all of them.\\nThat may be the real future of IMPILO. Because the next generation of showbiz will not simply be about who gets famous. It will be about who gets discovered, who gets a platform, who builds a community and what happens when those worlds collide.", "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "template": "EDITORIAL_FEATURE"}}	2026-10-21 10:35:32.566	2026-10-21 10:35:32.566	\N
cf476a94-a5a5-4c9c-8914-887bec5011f1	b8e83af3-54c3-46b9-b0bf-ee4a9f5924cf	IMAGE	16	{"layout": "full", "editorialLayout": {"role": "hero", "theme": "NEUTRAL", "template": "EDITORIAL_FEATURE"}}	2026-10-21 10:35:32.566	2026-10-21 10:35:32.566	a31fdb98-b485-4f7a-a4db-502e18105fd0
7d4ec4f8-31aa-486c-b41f-74de12d5ab27	b8e83af3-54c3-46b9-b0bf-ee4a9f5924cf	VIDEO	17	{"layout": "wide", "editorialLayout": {"role": "inline-image", "theme": "NEUTRAL", "template": "EDITORIAL_FEATURE"}}	2026-10-21 10:35:32.566	2026-10-21 10:35:32.566	cf809c76-1f38-4b5f-8d24-b50f52a7e647
56516287-c45e-4407-aa43-c2dda2db062c	98bf1363-e317-46d7-ae6b-bdb356488712	TEXT	1	{"text": "They Were Everywhere At first, they seemed ordinary. A few brown birds gathered on a rooftop outside a shopping centre. Others perched on streetlights, walked fearlessly between parked cars and scavenged for food near outdoor restaurants. Unlike many indigenous birds that quickly disappear when people approach, these birds appeared remarkably confident. They were noisy, energetic and completely at home in the middle of the city. Then something changed. As I continued photographing and filming them, I noticed behaviour that was impossible to ignore. Whenever smaller birds approached nearby trees or feeding areas, the newcomers reacted aggressively. Instead of tolerating the presence of native birds, they chased them relentlessly. Sometimes one bird would initiate the attack. Other times, several appeared to join in, forcing the smaller birds to retreat. Within moments, the indigenous birds had disappeared. The newcomers remained. That observation prompted an important question. Were these birds simply defending their territory, or was something far more significant happening in South Africa's urban ecosystems? The answer led to one of the world's most successful—and controversial—invasive bird species: the Common Myna, better known in southern Africa as the Indian Myna.", "layout": "default"}	2026-09-14 15:06:29.184	2026-09-14 15:06:29.184	\N
a44c6e61-9cb9-4c4c-b8eb-4e200a37c93e	98bf1363-e317-46d7-ae6b-bdb356488712	TEXT	2	{"text": "A Visitor That Never Left The Indian Myna (Acridotheres tristis) is native to the Indian subcontinent, where it forms part of the natural ecosystem. In India, Pakistan, Bangladesh and Nepal, the species evolved alongside native predators, competitors and environmental conditions over thousands of years. In many farming communities it is even appreciated because it feeds on insects that damage crops. Southern Africa is a different story. Historical records indicate that Indian Mynas became established in South Africa after birds escaped from captivity in Durban in the early 1900s. What began as a small population eventually expanded through towns and cities, taking advantage of an environment that offered abundant food, nesting opportunities and relatively few natural barriers. More than a century later, the species has spread across much of South Africa and into neighbouring countries, including Botswana. Unlike migratory birds that arrive and leave with the seasons, the Indian Myna has become a permanent resident. The question is no longer whether it belongs here. The question is what its long-term presence means for the birds that already did.", "layout": "default"}	2026-09-14 15:06:29.184	2026-09-14 15:06:29.184	\N
f0d7c91a-8032-4915-bcbd-0dd30e7c9d96	98bf1363-e317-46d7-ae6b-bdb356488712	TEXT	3	{"text": "The Perfect Urban Survivor Many invasive species fail because they cannot adapt to unfamiliar environments. The Indian Myna succeeded because it possesses an extraordinary combination of characteristics. It is intelligent. It is highly adaptable. It eats almost anything. It nests almost anywhere. It breeds quickly. Most importantly, it has learned to thrive alongside people. While many indigenous birds depend on specific habitats, the Indian Myna has turned human development into an advantage. Shopping centres become feeding grounds. Traffic lights become lookout posts. Roofs become nesting sites. Power poles become observation towers. Public parks become breeding territories. Every new suburb potentially creates another opportunity for expansion. Scientists often describe this type of species as an urban exploiter—an animal that benefits directly from human activity instead of being displaced by it. Unfortunately, that same adaptability creates increasing pressure on indigenous wildlife.", "layout": "default"}	2026-09-14 15:06:29.184	2026-09-14 15:06:29.184	\N
bc903352-20e5-4baa-ad16-0efa633085a0	98bf1363-e317-46d7-ae6b-bdb356488712	TEXT	4	{"text": "The Urban Bully Perhaps the Indian Myna's most controversial characteristic is not its appearance. It is its behaviour. Researchers across several countries have documented that Common Mynas aggressively defend feeding areas and nesting cavities against other bird species. During breeding season, this behaviour becomes even more pronounced. Birdwatchers frequently report seeing several mynas pursuing a single smaller bird through gardens, parks and suburban streets. My own observations reflected this pattern. While documenting birds for this investigation, I repeatedly watched Indian Mynas pursue much smaller indigenous birds away from trees and feeding locations. Whether defending territory or competing for resources, the outcome was always the same. The indigenous birds left. The mynas stayed. Scientists refer to this type of behaviour as aggressive territorial competition. It does not necessarily involve killing other birds. Instead, repeated harassment can prevent native species from accessing food, securing nesting sites or successfully raising their young. In ecology, survival is often determined not by strength alone, but by access to resources. If one species consistently controls those resources, others gradually begin to disappear from the same environment.", "layout": "default"}	2026-09-14 15:06:29.184	2026-09-14 15:06:29.184	\N
100ff872-33f3-47b2-9a3b-58926dba210f	98bf1363-e317-46d7-ae6b-bdb356488712	TEXT	5	{"text": "More Than Just Another Bird Some readers may wonder why this matters. After all, cities are full of birds. Does it really matter which species occupies our parks and neighbourhoods? The answer is yes. Every indigenous bird performs ecological functions developed over thousands of years. Some pollinate flowering plants. Others disperse seeds across forests and grasslands. Many naturally regulate insect populations. Predatory birds help maintain healthy food webs. Together they form an ecological network that keeps urban and natural environments functioning. When invasive species begin replacing native species, those relationships can change in ways that are not immediately obvious. The loss of a single bird species is rarely an isolated event. It can trigger a chain reaction that affects insects, plants and even other animals. Ecologists describe this as an imbalance within the ecosystem. Nature depends upon diversity. The fewer native species remain, the more fragile that balance becomes.", "layout": "default"}	2026-09-14 15:06:29.184	2026-09-14 15:06:29.184	\N
d962b930-0bca-4ca2-8c86-ebe15ab9d391	98bf1363-e317-46d7-ae6b-bdb356488712	TEXT	6	{"text": "A Warning from Botswana South Africans do not have to look far to understand what can happen when an invasive species spreads largely unchecked. Across the border, Botswana has become increasingly concerned about the expansion of Indian Myna populations, particularly around urban centres such as Gaborone, Lobatse, Kanye and Jwaneng. Conservationists there have documented the species' continued spread and raised concerns about its aggressive competition with indigenous birds for nesting sites and food. While research continues into the full ecological impact, the trend has been significant enough to attract attention from bird conservation organisations and environmental authorities. Botswana's experience serves as a warning rather than a prediction. It demonstrates how quickly an adaptable invasive species can establish itself once suitable habitat becomes available. The lesson for South Africa is simple. Waiting until the problem becomes overwhelming is far more difficult than recognising the warning signs early.", "layout": "default"}	2026-09-14 15:06:29.184	2026-09-14 15:06:29.184	\N
1247c2e6-5ada-4a90-8354-164607851fb6	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	HEADING	0	{"text": "# Before the Nation Had a Name: Honouring the Khoisan Heritage of South Africa", "richText": {"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2, "textAlign": null}, "content": [{"text": "# Before the Nation Had a Name: Honouring the Khoisan Heritage of South Africa", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}}]}, "editorialLayout": {"role": "title", "theme": "NEUTRAL", "columns": 2, "variant": "HEADING", "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
33c4d953-d807-470a-a6db-e34d368041c9	ad3ae4af-e706-4dab-90c3-6c896b1a1f41	TEXT	8	{"text": "1. The Short-Term Illusion (In-Context Learning) When you correct an AI in a live chat window and it immediately apologizes and fixes its output, the underlying neural network (the core \\"brain\\" of the AI) has not actually changed its parameters. This is known as in-context learning. The model is simply reading the history of your current, active chat session and mathematically adjusting its next prediction based on the immediate feedback you just provided. Once you hit \\"New Chat\\" or clear the context window, the model forgets that specific interaction entirely. It has not permanently learned from its mistake.\\nAI Self-Correction Using User Prompts: Is It Actually Happening? If you have ever corrected an AI mid-conversation—saying something like, \\"No, I meant the other definition of that word,\\" or \\"You forgot to include the third parameter in that code\\"—you might wonder if the AI actually learns from that correction. Is self-correction based on user prompts actually happening?", "layout": "default", "editorialLayout": {"role": "body-full", "theme": "LIME", "template": "EDUCATIONAL"}}	2026-10-19 11:55:44.569	2026-10-19 11:55:44.569	\N
ce9c04ac-a8f6-4233-a572-6d7c9faffd9d	ad3ae4af-e706-4dab-90c3-6c896b1a1f41	QUOTE	9	{"text": "The definitive answer is yes, it is happening constantly, but it occurs in two distinct phases: short-term illusion and long-term integration.", "editorialLayout": {"role": "pull-quote", "theme": "LIME", "variant": "QUOTE", "template": "EDUCATIONAL"}}	2026-10-19 11:55:44.569	2026-10-19 11:55:44.569	\N
458f5982-97fe-4535-abc3-97c167cf4560	ad3ae4af-e706-4dab-90c3-6c896b1a1f41	TEXT	10	{"text": "2. The Long-Term Integration (Post-Training and RLHF) While the model doesn't update its core weights on the fly, the companies hosting the AI absolutely do log your prompts, your corrections, and your implicit feedback (like hitting a \\"thumbs down\\" button, regenerating an answer, or editing your prompt to be clearer).\\nThis data is batched, anonymized (to varying degrees depending on the company's privacy policy), and used in a critical phase called Reinforcement Learning from Human Feedback (RLHF) or Direct Preference Optimization (DPO).", "layout": "default", "editorialLayout": {"role": "body-full", "theme": "LIME", "template": "EDUCATIONAL"}}	2026-10-19 11:55:44.569	2026-10-19 11:55:44.569	\N
2b93acd7-fc8e-4518-9ccf-5138d82a6db8	ad3ae4af-e706-4dab-90c3-6c896b1a1f41	TEXT	11	{"text": "During these post-training phases, AI engineers take massive datasets of real user interactions to train the next iteration of the model. When you tell an AI, \\"Your previous code had a bug, here is how you should have done it,\\" that entire exchange is flagged as highly valuable training data. In the lab, the AI is trained to recognize that its original answer was poor, and your corrected path is the optimal \\"reward\\" path.\\n\\nThe Rise of Automated Self-Correction Loops Beyond human feedback, the data you provide is being used to teach AI how to automatically self-correct in the future. We are now seeing a shift toward models explicitly trained to review their own work using synthetic data generated from real human prompts.", "layout": "default", "editorialLayout": {"role": "body-full", "theme": "LIME", "template": "EDUCATIONAL"}}	2026-10-19 11:55:44.569	2026-10-19 11:55:44.569	\N
98575d0e-dc61-4986-b61d-073226fd560b	ad3ae4af-e706-4dab-90c3-6c896b1a1f41	TEXT	12	{"text": "Here is how it works: AI labs take thousands of real user prompts. They force the AI to answer the question, and then prompt the AI again with a hidden system instruction: \\"Critique your previous answer for logic flaws, bias, or factual errors, and rewrite it.\\"\\n\\nBy training the next-generation models on millions of these \\"self-correction trajectories,\\" the model internalizes the cognitive ability to double-check its own work before it even hits your screen. Advanced AI systems today often run invisible, internal loops where a secondary agent verifies the primary agent's output, silently correcting it before delivering the final text to the user.", "layout": "default", "editorialLayout": {"role": "body-full", "theme": "LIME", "template": "EDUCATIONAL"}}	2026-10-19 11:55:44.569	2026-10-19 11:55:44.569	\N
183acbae-d008-4b3d-ac9a-2c2a2c2fab90	ad3ae4af-e706-4dab-90c3-6c896b1a1f41	TEXT	13	{"text": "The Verdict: A Symbiotic Economy To answer the ultimate question: We are all paying for this AI. Investors and tech conglomerates are providing the financial liquidity required to keep the servers humming, but everyday users are paying with their cognitive labor.\\n\\nEvery prompt you carefully craft, every typo you point out, and every logic error you force the AI to rethink is harvested to build the next generation of artificial intelligence. Unless you explicitly opt out of data sharing—or operate under strict enterprise privacy agreements—you are not just a consumer of AI. You are an unpaid AI trainer, participating in the largest decentralized data-labeling project in human history.", "layout": "default", "editorialLayout": {"role": "body-full", "theme": "LIME", "template": "EDUCATIONAL"}}	2026-10-19 11:55:44.569	2026-10-19 11:55:44.569	\N
5b969344-a6c6-4d69-b5e6-1e1760b7175b	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	HEADING	1	{"text": "### Heritage Day 2026 | Celebrating the people, knowledge and cultures rooted in the land", "richText": {"type": "doc", "content": [{"type": "heading", "attrs": {"level": 3, "textAlign": null}, "content": [{"text": "### Heritage Day 2026 | Celebrating the people, knowledge and cultures rooted in the land", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}}]}, "editorialLayout": {"role": "section-heading", "theme": "NEUTRAL", "columns": 2, "variant": "HEADING", "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
2390702a-b453-47f7-91c1-113ad17d6e80	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	2	{"text": "Long before South Africa became a country defined by provinces, borders, cities and modern political identities, the landscapes we now call home were inhabited by communities whose histories stretch back thousands of years.\\nAmong the most important of these are the **Khoisan peoples** — a term commonly used to refer collectively to the San and Khoikhoi (Khoe) peoples, whose histories, languages, cultures and relationships with the land form an essential part of southern Africa's heritage.\\nAs South Africa prepares to commemorate **Heritage Day on 24 September 2026**, there is an opportunity to look beyond the food, fashion, music and festivities that have become associated with the occasion and ask a deeper question:", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Long before South Africa became a country defined by provinces, borders, cities and modern political identities, the landscapes we now call home were inhabited by communities whose histories stretch back thousands of years.\\nAmong the most important of these are the **Khoisan peoples** — a term commonly used to refer collectively to the San and Khoikhoi (Khoe) peoples, whose histories, languages, cultures and relationships with the land form an essential part of southern Africa's heritage.\\nAs South Africa prepares to commemorate **Heritage Day on 24 September 2026**, there is an opportunity to look beyond the food, fashion, music and festivities that have become associated with the occasion and ask a deeper question:", "type": "text"}]}]}, "editorialLayout": {"role": "eyebrow", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
927669dd-d042-4866-9dfb-b7bfc0625cae	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	QUOTE	3	{"text": "Whose heritage are we celebrating, and how well do we actually know it?", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Whose heritage are we celebrating, and how well do we actually know it?", "type": "text"}]}]}, "editorialLayout": {"role": "pull-quote", "theme": "NEUTRAL", "columns": 2, "variant": "QUOTE", "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
eaf8f785-d970-4fdc-9f45-48c26eebffe2	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	4	{"text": "This year’s national Heritage Day theme,  “Celebrating Our Living Heritage: Strengthening the Ties That Bind Us,” places particular emphasis on heritage as something that continues to live through communities, knowledge, traditions, languages, practices and relationships between people and their environments.\\nIn that context, remembering the Khoisan is not simply about looking backwards.", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "This year’s national Heritage Day theme,  “Celebrating Our Living Heritage: Strengthening the Ties That Bind Us,” places particular emphasis on heritage as something that continues to live through communities, knowledge, traditions, languages, practices and relationships between people and their environments.\\nIn that context, remembering the Khoisan is not simply about looking backwards.", "type": "text"}]}]}, "editorialLayout": {"role": "deck", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
79c71ea7-488b-49f6-bd75-7c68ff9748c5	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	HEADING	5	{"text": "It is about recognising a living part of South Africa's story.", "richText": {"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2, "textAlign": null}, "content": [{"text": "It is about recognising a living part of South Africa's story.", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}}]}, "editorialLayout": {"role": "section-heading", "theme": "NEUTRAL", "columns": 2, "variant": "HEADING", "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
1dd99ff5-ef50-4232-b9b5-dcdecb945ad9	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	HEADING	6	{"text": "A history much older than the modern South African state\\nThe history of the San and Khoikhoi extends deep into southern Africa's past.", "richText": {"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2, "textAlign": null}, "content": [{"text": " A history much older than the modern South African state\\nThe history of the San and Khoikhoi extends deep into southern Africa's past.", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}}]}, "editorialLayout": {"role": "section-heading", "theme": "NEUTRAL", "columns": 2, "variant": "HEADING", "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
07fd2cca-db0f-4131-a06e-98a63739d75c	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	7	{"text": "The San are traditionally associated with hunter-gatherer societies, while the Khoikhoi developed pastoral traditions involving domesticated cattle, sheep and goats. According to South African History Online, communities associated with the Khoikhoi acquired domestic stock in the region roughly 2,300 years ago and subsequently spread across parts of southern Africa.", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "The San are traditionally associated with hunter-gatherer societies, while the Khoikhoi developed pastoral traditions involving domesticated cattle, sheep and goats. According to South African History Online, communities associated with the Khoikhoi acquired domestic stock in the region roughly 2,300 years ago and subsequently spread across parts of southern Africa.", "type": "text"}]}]}, "editorialLayout": {"role": "dropcap", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
ce5233a1-0e7c-407c-ac99-9ee60ffd98c8	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	QUOTE	8	{"text": "This distinction is important because the word “Khoisan” does not describe one single, uniform ethnic group", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "This distinction is important because the word “Khoisan” does not describe one single, uniform ethnic group", "type": "text"}]}]}, "editorialLayout": {"role": "pull-quote", "theme": "NEUTRAL", "columns": 2, "variant": "QUOTE", "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
0ff190c7-d0d4-410e-afe6-da94f3fc8ba8	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	9	{"text": "Rather, it has often been used by scholars as a collective term for peoples whose histories include the San hunter-gatherers and Khoe/Khoikhoi pastoralists. These communities had their own identities, languages, social structures and histories.\\nThe term itself therefore needs to be treated carefully.\\nIt is also important to avoid historical labels imposed by European settlers. Terms such as “Hottentot” and “Bushman”, which appear frequently in older colonial records, are now regarded as derogatory. South African History Online notes that these labels were imposed by colonial society and did not accurately represent the complexity of the people to whom they were applied.\\nLanguage provides another window into this history.", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Rather, it has often been used by scholars as a collective term for peoples whose histories include the San hunter-gatherers and Khoe/Khoikhoi pastoralists. These communities had their own identities, languages, social structures and histories.\\nThe term itself therefore needs to be treated carefully.\\nIt is also important to avoid historical labels imposed by European settlers. Terms such as “Hottentot” and “Bushman”, which appear frequently in older colonial records, are now regarded as derogatory. South African History Online notes that these labels were imposed by colonial society and did not accurately represent the complexity of the people to whom they were applied.\\nLanguage provides another window into this history.", "type": "text"}]}]}, "editorialLayout": {"role": "body-left", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
2b3810df-0b14-49f9-bb26-10437dc8dd8a	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	HEADING	10	{"text": "Khoisan-associated languages are particularly well known for their distinctive click consonants. The Khoe language family includes languages such as Nama, which continues to be spoken in parts of South Africa, Namibia and Botswana.\\nThese languages are not simply historical curiosities, they are repositories of memory.", "richText": {"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2, "textAlign": null}, "content": [{"text": "Khoisan-associated languages are particularly well known for their distinctive click consonants. The Khoe language family includes languages such as Nama, which continues to be spoken in parts of South Africa, Namibia and Botswana.\\nThese languages are not simply historical curiosities, they are repositories of memory.", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}}]}, "editorialLayout": {"role": "section-heading", "theme": "NEUTRAL", "columns": 2, "variant": "HEADING", "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
76dfd056-d715-41fa-b703-3682ace7baee	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	HEADING	11	{"text": "A different relationship with the land", "richText": {"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2, "textAlign": null}, "content": [{"text": " A different relationship with the land\\n", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}}]}, "editorialLayout": {"role": "section-heading", "theme": "NEUTRAL", "columns": 2, "variant": "HEADING", "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
c68e42ed-ad55-45c2-9a75-94628fbf310e	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	12	{"text": "One of the most important aspects of Khoisan heritage is the relationship between people, animals, land and seasonal movement.\\nKhoikhoi pastoral communities traditionally moved with their livestock in search of suitable grazing. Their settlements therefore needed to be adaptable. South African History Online describes houses constructed from lightweight poles and reed mats that could be assembled and dismantled as communities moved. Even everyday objects were designed with mobility in mind.", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "One of the most important aspects of Khoisan heritage is the relationship between people, animals, land and seasonal movement.\\nKhoikhoi pastoral communities traditionally moved with their livestock in search of suitable grazing. Their settlements therefore needed to be adaptable. South African History Online describes houses constructed from lightweight poles and reed mats that could be assembled and dismantled as communities moved. Even everyday objects were designed with mobility in mind.", "type": "text"}]}]}, "editorialLayout": {"role": "body-right", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
441ac905-8a78-4615-8c28-4a41207cd704	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	QUOTE	13	{"text": "This way of life challenges some modern assumptions about what constitutes a “settled” or “developed” society.", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "This way of life challenges some modern assumptions about what constitutes a “settled” or “developed” society.", "type": "text"}]}]}, "editorialLayout": {"role": "pull-quote", "theme": "NEUTRAL", "columns": 2, "variant": "QUOTE", "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
02b76dea-dafc-4421-b019-f16eedc7af46	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	14	{"text": "Mobility was not necessarily an absence of civilisation, It was an adaptation to the environment.", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Mobility was not necessarily an absence of civilisation, It was an adaptation to the environment.", "type": "text"}]}]}, "editorialLayout": {"role": "callout", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
e1d068ee-a7b8-4584-80e0-e8a1f20a606e	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	15	{"text": "The movement of people and animals was connected to water, grazing, seasons and the availability of natural resources. Knowledge of the landscape was therefore fundamental to survival.\\nFor the San, hunting and gathering required an equally sophisticated understanding of the environment. Knowledge of plants, animals, weather, geography and seasonal changes could determine whether a community survived. This represents a form of **indigenous knowledge** that deserves to be understood as knowledge rather than folklore.\\nModern discussions around sustainability, conservation and environmental responsibility increasingly recognise the importance of understanding how communities have historically interacted with their environments.\\nThe Khoisan story reminds us that environmental knowledge did not begin with modern environmental science.", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "The movement of people and animals was connected to water, grazing, seasons and the availability of natural resources. Knowledge of the landscape was therefore fundamental to survival.\\nFor the San, hunting and gathering required an equally sophisticated understanding of the environment. Knowledge of plants, animals, weather, geography and seasonal changes could determine whether a community survived. This represents a form of **indigenous knowledge** that deserves to be understood as knowledge rather than folklore.\\nModern discussions around sustainability, conservation and environmental responsibility increasingly recognise the importance of understanding how communities have historically interacted with their environments.\\nThe Khoisan story reminds us that environmental knowledge did not begin with modern environmental science.", "type": "text"}]}]}, "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
24f5fa7c-8ef1-4d58-9b53-7748b3a2047d	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	HEADING	16	{"text": "When colonialism transformed the story", "richText": {"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2, "textAlign": null}, "content": [{"text": "When colonialism transformed the story", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}}]}, "editorialLayout": {"role": "section-heading", "theme": "NEUTRAL", "columns": 2, "variant": "HEADING", "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
f849d283-7f20-4d10-8610-b70fb2cfa0c7	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	17	{"text": "The history of the Khoisan cannot be discussed honestly without confronting colonialism.\\nThe arrival and expansion of European settlement in southern Africa profoundly disrupted Khoikhoi and San societies.\\nThe Khoikhoi were among the first indigenous populations to encounter Dutch settlers at the Cape during the seventeenth century. As European settlement expanded, competition over land, livestock and resources intensified. Khoikhoi communities experienced dispossession, enslavement, violence and population decline.", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "The history of the Khoisan cannot be discussed honestly without confronting colonialism.\\nThe arrival and expansion of European settlement in southern Africa profoundly disrupted Khoikhoi and San societies.\\nThe Khoikhoi were among the first indigenous populations to encounter Dutch settlers at the Cape during the seventeenth century. As European settlement expanded, competition over land, livestock and resources intensified. Khoikhoi communities experienced dispossession, enslavement, violence and population decline.\\n", "type": "text"}]}]}, "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
a37fe7af-5950-4491-abc2-38581f759faf	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	HEADING	18	{"text": "The consequences extended beyond the loss of land.", "richText": {"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2, "textAlign": null}, "content": [{"text": "The consequences extended beyond the loss of land.\\n", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}}]}, "editorialLayout": {"role": "section-heading", "theme": "NEUTRAL", "columns": 2, "variant": "HEADING", "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
78d3bf56-a283-41fc-a505-c496627c0de1	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	19	{"text": "Colonialism also affected language, identity, social organisation and the transmission of cultural knowledge.\\nCommunities that had existed within complex networks of movement, trade, kinship and environmental knowledge were increasingly forced into circumstances determined by colonial economic and political systems, some resisted, Some moved, Some were incorporated into other communities, others were enslaved.\\nAnd over generations, identities were frequently obscured or reclassified by colonial authorities.", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Colonialism also affected language, identity, social organisation and the transmission of cultural knowledge.\\nCommunities that had existed within complex networks of movement, trade, kinship and environmental knowledge were increasingly forced into circumstances determined by colonial economic and political systems, some resisted, Some moved, Some were incorporated into other communities, others were enslaved.\\nAnd over generations, identities were frequently obscured or reclassified by colonial authorities.", "type": "text"}]}]}, "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
1a17b548-17a2-4dd4-8a5c-aa358d9ab1ae	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	20	{"text": "This history matters because the disappearance of a people from historical visibility does not necessarily mean that the people themselves disappeared.", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "This history matters because the disappearance of a people from historical visibility does not necessarily mean that the people themselves disappeared.", "type": "text"}]}]}, "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
f92fe7fc-d865-4344-8cdb-95a0c89da479	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	HEADING	21	{"text": "# The story of the Khoisan is also a story of survival", "richText": {"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2, "textAlign": null}, "content": [{"text": "# The story of the Khoisan is also a story of survival", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}}]}, "editorialLayout": {"role": "section-heading", "theme": "NEUTRAL", "columns": 2, "variant": "HEADING", "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
eaee3df5-5970-4e04-a818-ed6cc15a4ce7	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	22	{"text": "For many years, popular representations of the San and Khoikhoi reduced them to images of a distant prehistoric past. This history matters because the disappearance of a people from historical visibility does not necessarily mean that the people themselves disappeared.", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "For many years, popular representations of the San and Khoikhoi reduced them to images of a distant prehistoric past. This history matters because the disappearance of a people from historical visibility does not necessarily mean that the people themselves disappeared.\\n", "type": "text"}]}]}, "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
8e47ea52-e285-4d6b-825a-489bf3e27e7b	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	23	{"text": "That representation can be misleading.\\nThe Khoisan are not simply figures from a museum display or illustrations in a school textbook,\\nthere are contemporary communities who continue to identify with Khoisan heritage, languages, traditions and histories.", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "That representation can be misleading.\\nThe Khoisan are not simply figures from a museum display or illustrations in a school textbook,\\nthere are contemporary communities who continue to identify with Khoisan heritage, languages, traditions and histories.", "type": "text"}]}]}, "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
2c571e0e-b07b-49ea-8572-9501452adfbc	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	24	{"text": "South African History Online notes that Khoisan identity experienced renewed visibility after the end of apartheid, including increasing public discussion about the recognition of Khoisan communities, leadership and structures.\\nThis revival raises important questions about identity in contemporary South Africa.", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "South African History Online notes that Khoisan identity experienced renewed visibility after the end of apartheid, including increasing public discussion about the recognition of Khoisan communities, leadership and structures.\\nThis revival raises important questions about identity in contemporary South Africa.", "type": "text"}]}]}, "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
c84d61a4-401a-4d9b-8f55-60d269051e07	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	HEADING	25	{"text": "Who has the right to define a people's history?", "richText": {"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2, "textAlign": null}, "content": [{"text": "Who has the right to define a people's history?", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}}]}, "editorialLayout": {"role": "section-heading", "theme": "NEUTRAL", "columns": 2, "variant": "HEADING", "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
b0ae4818-924c-4c4a-996b-7916e1e6931e	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	26	{"text": "Who decides which traditions are preserved?\\nWhat happens when a language becomes endangered?\\nAnd how does a community reclaim an identity that colonialism attempted to erase, redefine or marginalise?\\nAnd how does a community reclaim an identity that colonialism attempted to erase, redefine or marginalise?", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Who decides which traditions are preserved?\\nWhat happens when a language becomes endangered?\\nAnd how does a community reclaim an identity that colonialism attempted to erase, redefine or marginalise?\\nAnd how does a community reclaim an identity that colonialism attempted to erase, redefine or marginalise?", "type": "text"}]}]}, "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
1ad958a3-d421-4116-b944-61fdcf8e11c0	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	27	{"text": "These are not questions that belong exclusively to historians , they belong to the present.", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "These are not questions that belong exclusively to historians , they belong to the present.", "type": "text"}]}]}, "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
ee2af527-8305-4693-b396-5a48a67c071a	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	QUOTE	28	{"text": "Heritage is more than a costume", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Heritage is more than a costume", "type": "text"}]}]}, "editorialLayout": {"role": "pull-quote", "theme": "NEUTRAL", "columns": 2, "variant": "QUOTE", "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
d68501f3-928f-400d-9cd2-cbbf425dc43f	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	29	{"text": "Heritage celebrations can sometimes become simplified into visible symbols: traditional clothing, food, dancing, music and ceremonies.\\nThese are important expressions of culture, but heritage goes much deeper.\\nThe South African government describes \\"living heritage\\"  as including cultural traditions, oral history, performance, ritual, popular memory, skills, techniques, indigenous knowledge and relationships between people and nature.", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Heritage celebrations can sometimes become simplified into visible symbols: traditional clothing, food, dancing, music and ceremonies.\\nThese are important expressions of culture, but heritage goes much deeper.\\nThe South African government describes \\"living heritage\\"  as including cultural traditions, oral history, performance, ritual, popular memory, skills, techniques, indigenous knowledge and relationships between people and nature.", "type": "text"}]}]}, "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
c8f4ff46-f863-496b-9c69-820b20370b6b	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	30	{"text": "That definition is particularly relevant when considering Khoisan heritage, a language is heritage.\\nA story passed from one generation to another is heritage.\\nKnowledge about plants and animals is heritage.\\nKnowledge about plants and animals is heritage.", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "That definition is particularly relevant when considering Khoisan heritage, a language is heritage.\\nA story passed from one generation to another is heritage.\\nKnowledge about plants and animals is heritage.\\nKnowledge about plants and animals is heritage.", "type": "text"}]}]}, "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
087208e7-5dd7-42fe-add8-44137bd448c4	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	31	{"text": "Traditional craftsmanship is heritage.\\nThe memory of a landscape is heritage,  and the right of descendants to understand and articulate their own history is also part of living heritage.\\nAnd the right of descendants to understand and articulate their own history is also part of living heritage.\\nThis is why Heritage Day should not simply be a celebration of what looks good in photographs,\\nit should also be an opportunity to learn.", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Traditional craftsmanship is heritage.\\nThe memory of a landscape is heritage,  and the right of descendants to understand and articulate their own history is also part of living heritage.\\nAnd the right of descendants to understand and articulate their own history is also part of living heritage.\\nThis is why Heritage Day should not simply be a celebration of what looks good in photographs,\\nit should also be an opportunity to learn.", "type": "text"}]}]}, "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
17aeda2b-ee24-49e7-a101-b245315321e9	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	HEADING	32	{"text": "Listening to the land", "richText": {"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2, "textAlign": null}, "content": [{"text": " Listening to the land", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}}]}, "editorialLayout": {"role": "section-heading", "theme": "NEUTRAL", "columns": 2, "variant": "HEADING", "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
c036a616-de1b-47c7-ad9c-4728ed3603fc	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	33	{"text": "There is perhaps a particularly powerful lesson in the Khoisan relationship with the natural environment.\\nModern South Africa is highly urbanised. Millions of people live in cities surrounded by concrete, highways, digital networks and commercial spaces. Yet beneath those modern landscapes are older histories.", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "There is perhaps a particularly powerful lesson in the Khoisan relationship with the natural environment.\\nModern South Africa is highly urbanised. Millions of people live in cities surrounded by concrete, highways, digital networks and commercial spaces. Yet beneath those modern landscapes are older histories.", "type": "text"}]}]}, "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
cd3a1b9b-64e4-42ca-9bd0-83d12c61207c	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	34	{"text": "The Western Cape, the Karoo, the Northern Cape, the Eastern Cape and large areas of southern Africa contain landscapes connected to generations of Indigenous communities.\\nThe names of rivers and places can preserve fragments of these histories.\\nSouth African History Online notes, for example, that the Gariep — meaning “river” — was an important geographical feature for Khoisan communities. The river was later renamed the Orange by European colonial authorities before the name Gariep was restored after 1994. A name can therefore become more than a name,  it can become a record of who was here.", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "The Western Cape, the Karoo, the Northern Cape, the Eastern Cape and large areas of southern Africa contain landscapes connected to generations of Indigenous communities.\\nThe names of rivers and places can preserve fragments of these histories.\\nSouth African History Online notes, for example, that the Gariep — meaning “river” — was an important geographical feature for Khoisan communities. The river was later renamed the Orange by European colonial authorities before the name Gariep was restored after 1994. A name can therefore become more than a name,  it can become a record of who was here.", "type": "text"}]}]}, "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
edb4d9f5-2ad4-4b38-b3a6-94b0228ad396	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	HEADING	35	{"text": "Why remembering the Khoisan matters today", "richText": {"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2, "textAlign": null}, "content": [{"text": "Why remembering the Khoisan matters today", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}}]}, "editorialLayout": {"role": "section-heading", "theme": "NEUTRAL", "columns": 2, "variant": "HEADING", "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
a930d8ae-7972-4b32-ba10-9ffe10fcfa4b	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	QUOTE	36	{"text": "Remembering Khoisan heritage is not about placing one culture above another.", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Remembering Khoisan heritage is not about placing one culture above another.", "type": "text"}]}]}, "editorialLayout": {"role": "pull-quote", "theme": "NEUTRAL", "columns": 2, "variant": "QUOTE", "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
3389fd7b-49a5-4b1d-b642-67fe92bee9d8	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	37	{"text": "South Africa's heritage is diverse precisely because its history is complex.\\nThe country is home to many cultural traditions, languages, communities and histories that have intersected, sometimes peacefully and sometimes through conflict, migration, trade, colonialism and forced displacement.\\nRecognising the Khoisan therefore contributes to a more complete understanding of South Africa.\\nIt also encourages us to reconsider what we mean when we say “heritage.”", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "South Africa's heritage is diverse precisely because its history is complex.\\nThe country is home to many cultural traditions, languages, communities and histories that have intersected, sometimes peacefully and sometimes through conflict, migration, trade, colonialism and forced displacement.\\nRecognising the Khoisan therefore contributes to a more complete understanding of South Africa.\\nIt also encourages us to reconsider what we mean when we say “heritage.”", "type": "text"}]}]}, "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
3fc8a396-6d2b-43eb-b8ba-aec73dcbc4a2	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	38	{"text": "Heritage is not only what we inherited from the recent past, it includes the much older foundations upon which later societies were built.\\nThe Khoisan story reminds South Africans that the history of this land did not begin with colonial settlement, nor with the creation of the Union of South Africa, nor with apartheid, nor even with the democratic transition of 1994.", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Heritage is not only what we inherited from the recent past, it includes the much older foundations upon which later societies were built.\\nThe Khoisan story reminds South Africans that the history of this land did not begin with colonial settlement, nor with the creation of the Union of South Africa, nor with apartheid, nor even with the democratic transition of 1994.", "type": "text"}]}]}, "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
16e44b2d-53c2-4883-8223-bc099a9df3f4	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	QUOTE	39	{"text": "Our history reaches much further back.", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Our history reaches much further back.", "type": "text"}]}]}, "editorialLayout": {"role": "pull-quote", "theme": "NEUTRAL", "columns": 2, "variant": "QUOTE", "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
b2c7fe4b-a472-4d88-a8c6-200203a93f64	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	HEADING	40	{"text": "A Heritage Day invitation: learn before you celebrate", "richText": {"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2, "textAlign": null}, "content": [{"text": "A Heritage Day invitation: learn before you celebrate", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}}]}, "editorialLayout": {"role": "section-heading", "theme": "NEUTRAL", "columns": 2, "variant": "HEADING", "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
612f4a6d-1ae0-4f55-9bef-e458a76bc34b	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	HEADING	41	{"text": "On 24 September, South Africans will once again celebrate Heritage Day.", "richText": {"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2, "textAlign": null}, "content": [{"text": "On 24 September, South Africans will once again celebrate Heritage Day.", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}}]}, "editorialLayout": {"role": "section-heading", "theme": "NEUTRAL", "columns": 2, "variant": "HEADING", "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
fc69bb40-ff85-4f85-8d35-b2e34f3b1b3c	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	42	{"text": "There will be food, there will be music ,  there will be traditional clothing.\\nThere will be gatherings, performances and celebrations across the country.", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "There will be food, there will be music ,  there will be traditional clothing.\\nThere will be gatherings, performances and celebrations across the country.", "type": "text"}]}]}, "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
99769109-7156-4925-999e-1a017f9c7b71	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	43	{"text": "But perhaps one of the most meaningful ways to celebrate is also one of the simplest:", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "But perhaps one of the most meaningful ways to celebrate is also one of the simplest:\\n", "type": "text"}]}]}, "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
7292f7a4-c79b-4f9e-823d-1cc9fdc990f7	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	QUOTE	44	{"text": "Learn something you did not know, earn about the San, earn about the San.", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Learn something you did not know, earn about the San, earn about the San.", "type": "text"}]}]}, "editorialLayout": {"role": "pull-quote", "theme": "NEUTRAL", "columns": 2, "variant": "QUOTE", "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
98c3ad4a-9a7f-4920-8e6a-d90f90fe04cb	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	45	{"text": "", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}}]}, "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
91600b09-734a-4d2d-ba2b-34496a2c5841	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	46	{"text": "Learn about the Khoikhoi.\\nLearn about Indigenous languages.\\nAnd, importantly, listen to contemporary Khoisan voices rather than assuming that outsiders can speak on behalf of Khoisan communities.\\nBecause heritage is not only about remembering the past., it is about recognising the people who carry that past into the present.", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Learn about the Khoikhoi.\\nLearn about Indigenous languages.\\nAnd, importantly, listen to contemporary Khoisan voices rather than assuming that outsiders can speak on behalf of Khoisan communities.\\nBecause heritage is not only about remembering the past., it is about recognising the people who carry that past into the present.", "type": "text"}]}]}, "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
7e472a9c-a7a4-43c3-9049-36573e780188	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	HEADING	47	{"text": "More than a footnote", "richText": {"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2, "textAlign": null}, "content": [{"text": " More than a footnote", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}}]}, "editorialLayout": {"role": "section-heading", "theme": "NEUTRAL", "columns": 2, "variant": "HEADING", "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
d06b65af-ee9a-4b5a-a476-af464a8d08f4	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	48	{"text": "The Khoisan should never be treated as a footnote in the story of South Africa.\\nTheir history is intertwined with the land, languages, ecology, migration, colonialism and cultural development of southern Africa. Their story contains hardship, displacement and loss, but it also contains adaptation, knowledge, cultural continuity and survival.\\nThat complexity is precisely what makes it worth remembering.\\nAs we commemorate Heritage Day 2026 under the theme “Celebrating Our Living Heritage: Strengthening the Ties That Bind Us,” the Khoisan story offers an important reminder: a nation does not become richer by forgetting the histories that came before it.", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "The Khoisan should never be treated as a footnote in the story of South Africa.\\nTheir history is intertwined with the land, languages, ecology, migration, colonialism and cultural development of southern Africa. Their story contains hardship, displacement and loss, but it also contains adaptation, knowledge, cultural continuity and survival.\\nThat complexity is precisely what makes it worth remembering.\\nAs we commemorate Heritage Day 2026 under the theme “Celebrating Our Living Heritage: Strengthening the Ties That Bind Us,” the Khoisan story offers an important reminder: a nation does not become richer by forgetting the histories that came before it.", "type": "text"}]}]}, "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
1616e793-8b00-4beb-9344-9e204a30e48f	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	49	{"text": "It becomes richer by understanding them. And perhaps that is what Heritage Day should ultimately ask of all of us.", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "It becomes richer by understanding them. And perhaps that is what Heritage Day should ultimately ask of all of us.", "type": "text"}]}]}, "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
c478fd3c-1134-4b74-a5d5-5d8861d26e0a	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	50	{"text": "Not simply:", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Not simply:", "type": "text"}]}]}, "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
74d034d1-3129-4e45-964e-e7eb50abef3a	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	51	{"text": "“What culture do I celebrate?”", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "“What culture do I celebrate?”", "type": "text"}]}]}, "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
d6ddf55b-f865-4a9e-926c-40b17e82c335	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	52	{"text": "But:\\n“What histories do I understand, whose voices have I heard, and what heritage will I help carry forward?”\\nFor the Khoisan, that heritage is not confined to the pages of history,  it lives in communities,   it lives in the landscape.\\nAnd it remains part of the heartbeat of South Africa.", "layout": "default", "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "But:\\n“What histories do I understand, whose voices have I heard, and what heritage will I help carry forward?”\\nFor the Khoisan, that heritage is not confined to the pages of history,  it lives in communities,   it lives in the landscape.\\nAnd it remains part of the heartbeat of South Africa.", "type": "text"}]}]}, "editorialLayout": {"role": "body-full", "theme": "NEUTRAL", "columns": 2, "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
99af417e-89e7-4000-9129-a3ed74b60a85	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	HEADING	53	{"text": "Editorial note", "richText": {"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2, "textAlign": null}, "content": [{"text": "Editorial note", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}}]}, "editorialLayout": {"role": "section-heading", "theme": "NEUTRAL", "columns": 2, "variant": "HEADING", "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
68943e4d-efcc-4029-96e1-13922afc2927	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	HEADING	54	{"text": "*This article draws substantially on historical material published by South African History Online, particularly its overview of the Khoisan, while adapting the material into an editorial feature for Heritage Day. The term “Khoisan” is used here as a broad historical and scholarly descriptor for San and Khoe/Khoikhoi peoples; it should not be interpreted as suggesting that these communities constitute a single homogeneous ethnic group. Historical terminology appearing in colonial sources has also been contextualised rather than reproduced as contemporary terminology.*", "richText": {"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2, "textAlign": null}, "content": [{"text": "*This article draws substantially on historical material published by South African History Online, particularly its overview of the Khoisan, while adapting the material into an editorial feature for Heritage Day. The term “Khoisan” is used here as a broad historical and scholarly descriptor for San and Khoe/Khoikhoi peoples; it should not be interpreted as suggesting that these communities constitute a single homogeneous ethnic group. Historical terminology appearing in colonial sources has also been contextualised rather than reproduced as contemporary terminology.*", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}}]}, "editorialLayout": {"role": "section-heading", "theme": "NEUTRAL", "columns": 2, "variant": "HEADING", "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
846a2303-0db4-4b31-98fc-97bf1283b201	d92b0878-ba9d-41f1-aa4c-1e0b35948e48	TEXT	55	{"url": "", "text": "Sources: South African History Online, *The Khoisan* (updated 20 July 2026); South African Government, Heritage Day and 2026 Heritage Month material.", "source": "", "footnote": true, "richText": {"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Sources: South African History Online, *The Khoisan* (updated 20 July 2026); South African Government, Heritage Day and 2026 Heritage Month material.", "type": "text"}]}]}, "editorialLayout": {"role": "footnote", "theme": "NEUTRAL", "columns": 2, "variant": "FOOTNOTE", "template": "EDUCATIONAL", "columnLayout": "two"}}	2026-10-21 14:23:44.599	2026-10-21 14:23:44.599	\N
\.


--
-- Data for Name: ArticleCategory; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."ArticleCategory" ("articleId", "categoryId") FROM stdin;
\.


--
-- Data for Name: ArticleQuiz; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."ArticleQuiz" (id, "articleId", title, description, "passingScore", "createdAt", "updatedAt") FROM stdin;
2e4f6333-e0c8-4c13-9f93-97be4fed7769	b8e83af3-54c3-46b9-b0bf-ee4a9f5924cf	How Well Do You Know IMPILO? 🎮	Test your knowledge of the new IMPILO showbiz model.	70	2026-08-09 20:14:32.483	2026-08-09 23:00:03.756
\.


--
-- Data for Name: ArticleRevision; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."ArticleRevision" (id, "articleId", version, title, excerpt, content, "createdById", "createdAt") FROM stdin;
\.


--
-- Data for Name: ArticleTag; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."ArticleTag" ("articleId", "tagId") FROM stdin;
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Category" (id, name, slug, description, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: MagazineIssue; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."MagazineIssue" (id, title, slug, description, "issueNumber", volume, "coverUrl", "publishedAt", "createdAt", "updatedAt") FROM stdin;
305C4737-FD70-4150-97F7-E8E37EF78D7A	IMPILO 101	impilo-101	The first interactive audio visual  IMPILO digital magazine issue.	101	Volume 101	https://pub-3b74daf955444cf484ba5da4777ce1ec.r2.dev/assets/mag_cover/master_cover.png?auto=compress&cs=tinysrgb&dpr=1&w=1500	2026-08-12 14:58:03.999	2026-08-12 17:00:17.826	2026-09-09 10:46:55.401
53d531e3-8bfb-4916-b5ce-8ceedb1fdcfe	Impilo New Dawn	impilo-dawn	A new dawn of media	\N	\N	\N	2026-10-11 00:23:15.943	2026-09-14 13:57:14.594	2026-10-11 00:23:15.944
\.


--
-- Data for Name: MagazinePage; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."MagazinePage" (id, "issueId", "position", type, title, slug, "articleId", content, "createdAt", "updatedAt") FROM stdin;
17092691-9300-4ddd-9609-2c585db99f2c	305C4737-FD70-4150-97F7-E8E37EF78D7A	1	COVER	IMPILO 101	\N	\N	\N	2026-08-12 15:12:54.652	2026-09-09 11:00:13.346
9b46627f-d38f-46d7-b23c-4800e30e22f4	305C4737-FD70-4150-97F7-E8E37EF78D7A	2	ABOUT	About IMPILO	\N	\N	\N	2026-08-12 15:12:54.663	2026-09-09 11:00:13.349
c369fbcf-2780-4e8c-a5b6-1d19ac4800ca	305C4737-FD70-4150-97F7-E8E37EF78D7A	3	CONTENTS	Contents	\N	\N	\N	2026-08-12 15:12:54.666	2026-09-09 11:00:13.35
8ed43577-5d51-40c0-ad0d-95e89657bad0	305C4737-FD70-4150-97F7-E8E37EF78D7A	4	HIGHLIGHTS	Highlights	\N	\N	\N	2026-08-12 15:12:54.66	2026-09-09 11:00:13.351
280a04c1-808a-4352-b7b2-02b2d4db075b	305C4737-FD70-4150-97F7-E8E37EF78D7A	5	ARTICLE	How Well Do You Know IMPILO? 🎮	\N	b8e83af3-54c3-46b9-b0bf-ee4a9f5924cf	\N	2026-08-12 15:12:54.671	2026-09-09 11:00:13.351
597f746a-159c-493a-8fcf-13a264f20bcb	53d531e3-8bfb-4916-b5ce-8ceedb1fdcfe	1	COVER	cover	impilo-dawn	\N	null	2026-10-11 00:22:26.663	2026-10-11 00:24:24.317
0e3bff40-0870-4dfb-9d42-3371d3eabba8	305C4737-FD70-4150-97F7-E8E37EF78D7A	6	ARTICLE	ai--revenue	ai-rev	ad3ae4af-e706-4dab-90c3-6c896b1a1f41	null	2026-10-11 00:37:54.66	2026-10-11 00:37:54.66
9e8760ca-8f07-40d8-9b66-2fb9f01bb1f2	305C4737-FD70-4150-97F7-E8E37EF78D7A	7	GAME	Game-fash	gam-fash	\N	{"game": {"url": "http://localhost:5173", "theme": "DARK_BLUE", "title": "Game-fash", "gameId": "fashion-runway", "status": "DRAFT", "category": "STYLE & DESIGN", "coverImage": "/images/games/fashion-runway-cover.jpg", "description": "Build a signature look, choose your styling details and prepare your model for the runway.", "displayMode": "embedded", "allowFullscreen": true, "estimatedMinutes": 5, "shortDescription": "Create the look. Own the runway."}}	2026-11-16 09:05:52.044	2026-11-16 14:03:09.74
2a88ba81-f677-4f44-bf33-3a6841b9b230	305C4737-FD70-4150-97F7-E8E37EF78D7A	8	GAME	Stickman	game-fight	\N	{"game": {"url": "http://localhost:5174", "theme": "RED_WINE", "title": "Stickman", "gameId": "creative-arcade", "status": "DRAFT", "category": "ARCADE", "coverImage": "/images/games/creative-arcade-cover.jpg", "description": "A quick-play arcade space for bite-sized challenges and creative competitions.", "displayMode": "embedded", "allowFullscreen": true, "estimatedMinutes": 2, "shortDescription": "Play a quick round."}}	2026-11-16 10:16:46.527	2026-11-16 13:40:34.187
\.


--
-- Data for Name: MediaAsset; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."MediaAsset" (id, url, type, "mimeType", filename, "altText", caption, credit, width, height, duration, "createdAt", "updatedAt", "externalId", provider) FROM stdin;
cdc32753-d4af-40be-8c88-b31cb3d03b35	https://www.youtube.com/watch?v=YOUR_VIDEO_ID	VIDEO	\N	\N	\N	IMPILO video	\N	\N	\N	\N	2026-08-09 19:08:30.132	2026-08-09 19:08:30.132	YOUR_VIDEO_ID	YOUTUBE
a31fdb98-b485-4f7a-a4db-502e18105fd0	YOUR_CLOUDFRONT_IMAGE_URL	IMAGE	image/jpeg	\N	IMPILO Magazine	IMPILO Magazine	IMPILO Magazine	\N	\N	\N	2026-08-09 19:09:00.058	2026-08-09 19:09:00.058	\N	CLOUDFRONT
cf809c76-1f38-4b5f-8d24-b50f52a7e647	https://www.youtube.com/watch?v=HdkV7DA4aUs&t=26s	VIDEO	\N	\N	\N	IMPILO video	\N	\N	\N	\N	2026-08-09 19:45:11.667	2026-08-09 19:45:11.667	HdkV7DA4aUs	YOUTUBE
821b2ff5-0842-444d-8a17-5dbedce5f6c1	https://d1zrm2iszdbieq.cloudfront.net/assets/models_land/1.jpg	IMAGE	\N	1.jpg	\N	\N	\N	\N	\N	\N	2026-08-12 23:47:11.919	2026-08-12 23:47:11.919	\N	CLOUDFRONT
919b7011-4d2c-4927-98e4-200ade910299	https://d1zrm2iszdbieq.cloudfront.net/assets/models_land/1.jpg	IMAGE	\N	1.jpg	\N	\N	\N	\N	\N	\N	2026-08-13 00:16:12.942	2026-08-13 00:16:12.942	\N	CLOUDFRONT
ab15b93f-98f7-4330-a1a3-c12433cb7830	https://youtu.be/1n2NEOYhZ38	VIDEO	\N	\N	\N	\N	\N	\N	\N	\N	2026-08-13 00:23:55.298	2026-08-13 00:23:55.298	1n2NEOYhZ38	YOUTUBE
e0d01209-a865-47db-a153-30b33552fb89	https://d1zrm2iszdbieq.cloudfront.net/articles/models/Sagery/📸/IMG_4695.MOV	VIDEO	video/quicktime	IMG_4695.MOV	\N	\N	\N	\N	\N	\N	2026-08-13 00:39:33.212	2026-08-13 00:39:33.212	\N	CLOUDFRONT
05e5a844-66ae-4b75-a3a8-7034d1ca3804	https://d1zrm2iszdbieq.cloudfront.net/articles/editorial/images/1786839725652-f548c4299e50cd7e.jpeg	IMAGE	image/jpeg	da.jpeg	\N	\N	\N	\N	\N	\N	2026-08-16 00:22:07.91	2026-08-16 00:22:07.91	\N	CLOUDFRONT
9cada5ee-c9d2-4379-8e1e-62299b3770c9	https://d1zrm2iszdbieq.cloudfront.net/articles/editorial/videos/1786839765008-58021812ec4e986e.mkv	VIDEO	video/matroska	2026-07-13 14-15-10.mkv	\N	\N	\N	\N	\N	\N	2026-08-16 00:22:48.55	2026-08-16 00:22:48.55	\N	CLOUDFRONT
6016a4db-c303-4134-8b27-9ab875d180a4	https://d1zrm2iszdbieq.cloudfront.net/articles/editorial/images/1786841256295-b7f7dd012eb94e9c.jpeg	IMAGE	image/jpeg	da.jpeg	\N	\N	\N	\N	\N	\N	2026-08-16 00:47:38.116	2026-08-16 00:47:38.116	\N	CLOUDFRONT
18659787-01ed-44af-a18d-7c1bf2d3086f	https://d1zrm2iszdbieq.cloudfront.net/articles/editorial/images/1786841289144-e2b7f199cea93888.jpeg	IMAGE	image/jpeg	da.jpeg	IMPILO editorial photograph	IMPILO Editorial Test	IMPILO Magazine	\N	\N	\N	2026-08-16 00:48:14.738	2026-08-16 00:49:46.191	\N	CLOUDFRONT
4c57deb0-d4e9-4583-8422-6a1da13daec2	/articles/models/Sagery/📸/Drone.mp4	VIDEO	\N	Drone.mp4	\N	\N	\N	\N	\N	\N	2026-08-30 22:50:18.752	2026-08-30 22:50:18.752	\N	R2
ef081cab-5210-4155-b6e2-3d0b80f31fd9	https://pub-3b74daf955444cf484ba5da4777ce1ec.r2.dev/articles/editorial/images/1789658735197-fe7108a458f377ee.png	IMAGE	image/png	Screenshot 2026-09-17 at 17.16.11.png	\N	\N	\N	\N	\N	\N	2026-09-17 15:25:41.161	2026-09-17 15:25:41.161	\N	R2
\.


--
-- Data for Name: PointsTransaction; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."PointsTransaction" (id, "userId", points, reason, "eventId", "createdAt") FROM stdin;
537df586-6723-433c-93a1-1527f09904b3	97edeec0-383c-42b5-b645-8f0ac9f9e756	30	Quiz completed (50%)	95124eea-3cdd-491e-a9b8-d47a03442642	2026-08-09 23:49:00.757
ed41a447-f380-43a7-abbd-6aa653e5b8ca	97edeec0-383c-42b5-b645-8f0ac9f9e756	25	Achievement earned: First Quiz	fd520a46-d26c-4f61-bce6-2db657cf8fca	2026-08-09 23:49:01.235
\.


--
-- Data for Name: QuizAnswer; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."QuizAnswer" (id, "attemptId", "questionId", "optionId", "isCorrect", points, "hintsUsed", "attemptsUsed", "createdAt") FROM stdin;
48f9f5f4-f9dd-490e-a7e6-a60c2dcee7bc	6feaf9fb-c77c-42ab-ae7e-57ae07a61fb6	c1db7f29-21ff-40a1-8268-ef6045fa550e	62fbac5d-b037-4f59-9bd7-7018ef1b286c	t	20	0	1	2026-08-09 21:11:43.69
22490dc2-d0ff-4b6e-ad12-8b16408226f7	6feaf9fb-c77c-42ab-ae7e-57ae07a61fb6	9157c1d3-3135-4ea7-a2f2-e41e62eced4b	8c8915c4-7dd8-44f7-a376-0224df3b5fd0	t	20	0	1	2026-08-09 21:11:43.69
2fd09fd3-9b43-4e54-9fcd-6b65a04ea803	6a1161b6-1727-41e7-8acd-cc18a17e3af9	c1db7f29-21ff-40a1-8268-ef6045fa550e	62fbac5d-b037-4f59-9bd7-7018ef1b286c	t	15	1	1	2026-08-09 21:14:08.204
34d081a6-557e-4a3b-9537-1064d79451f0	6a1161b6-1727-41e7-8acd-cc18a17e3af9	9157c1d3-3135-4ea7-a2f2-e41e62eced4b	8c8915c4-7dd8-44f7-a376-0224df3b5fd0	t	20	0	1	2026-08-09 21:14:08.204
76ab2550-0d88-4ef2-b248-27d2b13d3535	1dc742bd-0479-4ac3-9ecd-976ce70c0ec6	c1db7f29-21ff-40a1-8268-ef6045fa550e	62fbac5d-b037-4f59-9bd7-7018ef1b286c	t	10	0	2	2026-08-09 21:14:33.654
c24f8874-fe63-41fa-8d61-02fc8edd170f	1dc742bd-0479-4ac3-9ecd-976ce70c0ec6	9157c1d3-3135-4ea7-a2f2-e41e62eced4b	8c8915c4-7dd8-44f7-a376-0224df3b5fd0	t	20	0	1	2026-08-09 21:14:33.654
bb9e8e4a-f499-44f9-8293-086f0780235c	59935558-d8f6-485a-92ce-e291abf0c3cc	c1db7f29-21ff-40a1-8268-ef6045fa550e	62fbac5d-b037-4f59-9bd7-7018ef1b286c	t	5	1	2	2026-08-09 22:32:17.826
aa29b8b9-abe0-4510-b847-c1a3a049c0a8	59935558-d8f6-485a-92ce-e291abf0c3cc	9157c1d3-3135-4ea7-a2f2-e41e62eced4b	8c8915c4-7dd8-44f7-a376-0224df3b5fd0	t	20	0	1	2026-08-09 22:32:17.826
f212922f-360f-4aa4-9125-e45d5cad6887	95124eea-3cdd-491e-a9b8-d47a03442642	c1db7f29-21ff-40a1-8268-ef6045fa550e	62fbac5d-b037-4f59-9bd7-7018ef1b286c	t	20	0	1	2026-08-09 23:49:00.52
a3332e88-80e3-44ef-9551-3c6ece02fa88	95124eea-3cdd-491e-a9b8-d47a03442642	9157c1d3-3135-4ea7-a2f2-e41e62eced4b	8c8915c4-7dd8-44f7-a376-0224df3b5fd0	t	20	0	1	2026-08-09 23:49:00.52
\.


--
-- Data for Name: QuizAttempt; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."QuizAttempt" (id, "quizId", "userId", score, total, percentage, "completedAt", "attemptNumber", "attemptPenalty", "basePoints", "hintPenalty", "hintsUsed", "retriesUsed", "retryPenalty") FROM stdin;
d0cc1146-30d7-497f-ab31-0bb22cedc14a	2e4f6333-e0c8-4c13-9f93-97be4fed7769	97edeec0-383c-42b5-b645-8f0ac9f9e756	0	2	0	2026-08-09 20:18:29.759	1	0	0	0	0	0	0
687daa99-b38e-4f69-86b1-d5fe00e9b637	2e4f6333-e0c8-4c13-9f93-97be4fed7769	97edeec0-383c-42b5-b645-8f0ac9f9e756	2	2	100	2026-08-09 20:20:28.767	1	0	0	0	0	0	0
6feaf9fb-c77c-42ab-ae7e-57ae07a61fb6	2e4f6333-e0c8-4c13-9f93-97be4fed7769	97edeec0-383c-42b5-b645-8f0ac9f9e756	24	2	60	2026-08-09 21:11:43.684	3	16	40	0	0	0	0
6a1161b6-1727-41e7-8acd-cc18a17e3af9	2e4f6333-e0c8-4c13-9f93-97be4fed7769	97edeec0-383c-42b5-b645-8f0ac9f9e756	17	2	42.5	2026-08-09 21:14:08.176	4	18	40	5	1	0	0
1dc742bd-0479-4ac3-9ecd-976ce70c0ec6	2e4f6333-e0c8-4c13-9f93-97be4fed7769	97edeec0-383c-42b5-b645-8f0ac9f9e756	15	2	37.5	2026-08-09 21:14:33.65	5	15	40	0	0	1	10
59935558-d8f6-485a-92ce-e291abf0c3cc	2e4f6333-e0c8-4c13-9f93-97be4fed7769	97edeec0-383c-42b5-b645-8f0ac9f9e756	12	2	30	2026-08-09 22:32:17.813	6	13	40	5	1	1	10
95124eea-3cdd-491e-a9b8-d47a03442642	2e4f6333-e0c8-4c13-9f93-97be4fed7769	97edeec0-383c-42b5-b645-8f0ac9f9e756	20	2	50	2026-08-09 23:49:00.14	7	20	40	0	0	0	0
\.


--
-- Data for Name: QuizOption; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."QuizOption" (id, "questionId", text, "isCorrect", "position") FROM stdin;
49e56f05-2353-4331-95e4-752e54e588d9	c1db7f29-21ff-40a1-8268-ef6045fa550e	A traditional print-only magazine	f	0
62fbac5d-b037-4f59-9bd7-7018ef1b286c	c1db7f29-21ff-40a1-8268-ef6045fa550e	A new kind of showbiz platform	t	1
0d98fccf-017d-463c-a741-99b6af223c58	c1db7f29-21ff-40a1-8268-ef6045fa550e	A television-only network	f	2
0aa6ccbe-740f-4597-b54c-e3d231fc17ce	9157c1d3-3135-4ea7-a2f2-e41e62eced4b	Only a printed article	f	0
8c8915c4-7dd8-44f7-a376-0224df3b5fd0	9157c1d3-3135-4ea7-a2f2-e41e62eced4b	A catalogue profile and other connected content	t	1
ba52b85b-d916-4650-8be6-afc57aab4415	9157c1d3-3135-4ea7-a2f2-e41e62eced4b	Nothing beyond the article	f	2
\.


--
-- Data for Name: QuizQuestion; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."QuizQuestion" (id, "quizId", question, "position", hint) FROM stdin;
c1db7f29-21ff-40a1-8268-ef6045fa550e	2e4f6333-e0c8-4c13-9f93-97be4fed7769	What is IMPILO Magazine building?	0	Think beyond the traditional magazine and consider entertainment, fashion, video and community.
9157c1d3-3135-4ea7-a2f2-e41e62eced4b	2e4f6333-e0c8-4c13-9f93-97be4fed7769	What can a fashion story lead an audience to discover?	1	Think about what happens beyond the article itself.
\.


--
-- Data for Name: QuizSession; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."QuizSession" (id, "quizId", "userId", "startedAt", "updatedAt", "completedAt") FROM stdin;
a1318cab-33f3-45e9-99e6-f27829b090c8	2e4f6333-e0c8-4c13-9f93-97be4fed7769	97edeec0-383c-42b5-b645-8f0ac9f9e756	2026-08-09 22:15:17.101	2026-08-09 22:32:17.834	2026-08-09 22:32:17.833
0a926b87-a796-4ae1-8fca-b2bf4ac16d58	2e4f6333-e0c8-4c13-9f93-97be4fed7769	97edeec0-383c-42b5-b645-8f0ac9f9e756	2026-08-09 23:19:28.181	2026-08-09 23:49:01.238	2026-08-09 23:49:01.237
\.


--
-- Data for Name: QuizSessionQuestion; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."QuizSessionQuestion" (id, "sessionId", "questionId", "hintsUsed", "attemptsUsed", answered, "isCorrect", "optionId") FROM stdin;
a39c3c18-f15d-4e92-a460-643bf7803701	a1318cab-33f3-45e9-99e6-f27829b090c8	c1db7f29-21ff-40a1-8268-ef6045fa550e	1	2	t	t	62fbac5d-b037-4f59-9bd7-7018ef1b286c
93800f07-b169-4ec1-9744-285cebd8847d	a1318cab-33f3-45e9-99e6-f27829b090c8	9157c1d3-3135-4ea7-a2f2-e41e62eced4b	0	1	t	t	8c8915c4-7dd8-44f7-a376-0224df3b5fd0
dd55d1ef-717e-4588-b056-c7d04ec2cf15	0a926b87-a796-4ae1-8fca-b2bf4ac16d58	c1db7f29-21ff-40a1-8268-ef6045fa550e	0	1	t	t	62fbac5d-b037-4f59-9bd7-7018ef1b286c
758f0ec5-0dc0-49a4-b982-eb8018854c3a	0a926b87-a796-4ae1-8fca-b2bf4ac16d58	9157c1d3-3135-4ea7-a2f2-e41e62eced4b	0	1	t	t	8c8915c4-7dd8-44f7-a376-0224df3b5fd0
\.


--
-- Data for Name: ReaderAchievement; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."ReaderAchievement" (id, "userId", "achievementId", "earnedAt") FROM stdin;
fd520a46-d26c-4f61-bce6-2db657cf8fca	97edeec0-383c-42b5-b645-8f0ac9f9e756	d5e04d6e-07e7-42c6-9bb6-e4fec73789b0	2026-08-09 23:49:01.233
\.


--
-- Data for Name: ReaderEvent; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."ReaderEvent" (id, "userId", type, metadata, "createdAt") FROM stdin;
f34415dd-ddf6-4103-9acb-7aaef2a85c0e	97edeec0-383c-42b5-b645-8f0ac9f9e756	QUIZ_COMPLETED	{"score": 20, "passed": false, "quizId": "2e4f6333-e0c8-4c13-9f93-97be4fed7769", "attemptId": "95124eea-3cdd-491e-a9b8-d47a03442642", "percentage": 50, "pointsEarned": 30}	2026-08-09 23:49:00.902
14afafe7-731b-4ca8-925f-047fc39c5004	97edeec0-383c-42b5-b645-8f0ac9f9e756	ACHIEVEMENT_EARNED	{"code": "FIRST_QUIZ", "name": "First Quiz", "points": 25, "achievementId": "d5e04d6e-07e7-42c6-9bb6-e4fec73789b0"}	2026-08-09 23:49:01.236
\.


--
-- Data for Name: ReadingProgress; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."ReadingProgress" (id, "userId", "articleId", "issueId", progress, "position", "startedAt", "lastReadAt", "completedAt") FROM stdin;
\.


--
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Tag" (id, name, slug, "createdAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."User" (id, username, "displayName", role, "createdAt", "updatedAt", email, "passwordHash", "avatarUrl", "readerTokenHash") FROM stdin;
97edeec0-383c-42b5-b645-8f0ac9f9e756	impilo_admin	Impilo Administrator	ADMIN	2026-08-09 14:51:30.911	2026-08-09 14:51:30.911	admin@impilomag.co.za	$2b$12$GinSM/l8yYFKGdh66DPvFOShK/0jqZklktXThlggdh3raBL1K0h86	\N	\N
4dc93ee1-1103-4c10-b804-2f824517d094	avidreader0000	\N	READER	2026-08-09 17:22:58.603	2026-08-09 17:22:58.603	\N	\N	\N	\N
5e312655-48ff-499f-8a3b-79f46424ac8b	avidreader9629	\N	READER	2026-08-09 17:38:48.135	2026-08-09 17:38:48.135	\N	\N	\N	a3a9e1ed9732cab28868127be00f1ce921acaefdd5c3b23a6e9e0072bd9c1a34
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
39116a33-b7d8-489b-8c14-6693a327106f	3bdf282fd3ef18a8c0d0fa69d0067a6ff0c8484ec1516467f30740ae1a9db755	2026-08-09 15:44:12.017739+02	20260809134412_init_users_roles	\N	\N	2026-08-09 15:44:12.012819+02	1
67691a63-7ed0-43d1-83d7-6f5afaea0799	b8ecbaf7a5089d7e086e6cee4b27c997076d933d4bd8e42db92bc2d23bc2fa1b	2026-08-12 16:36:33.142918+02	20260812143633_add_magazine_issue_pages	\N	\N	2026-08-12 16:36:33.11601+02	1
f2a2879e-9232-4c0f-8754-f19ca43521e6	76b91552096ec7e80793a32963c2ea97bd94e4ecb76e793a180574c970e4147e	2026-08-09 16:09:55.689923+02	20260809140955_reader_engagement	\N	\N	2026-08-09 16:09:55.644046+02	1
9fb7ad68-46a1-4ec1-b3dd-498b806a6fcc	cfb56b9ab65df9b2d529fed1641c46500b17442af1f5a444c3b6ee215f588bd5	2026-08-09 18:07:06.112672+02	20260809160706_editorial_articles_quizzes	\N	\N	2026-08-09 18:07:06.070208+02	1
aa851ff9-8215-4dff-ab87-c4cc3dcdcd72	31cf8756dffade57fa99ee674574e359a3d208c5376f3fda60b94f85ecc174f7	2026-08-09 18:17:07.398228+02	20260809161707_add_moderator_role	\N	\N	2026-08-09 18:17:07.397095+02	1
e344b98b-1c63-4d93-8f31-b6a71d312d27	477d50da8373de5c2bce671cd3f7072acb6769d0517f42ecf6d49e2b6d52cdfb	2026-11-16 10:09:23.505066+02	20261116080923_add_game_magazine_page_type	\N	\N	2026-11-16 10:09:23.502562+02	1
8dcb02ac-2f43-47eb-a69b-4190a4c01069	bf202dedf1e2fff314e19a9afc4e34967cb82a2b7a67ec99675df7a8c9721a11	2026-08-09 18:36:58.011512+02	20260809163658_article_approval_workflow	\N	\N	2026-08-09 18:36:58.008406+02	1
80aeaec1-c4c6-4c2c-a515-71d12d028c3d	38bd752915edbb42a30d6c88994ee9b07dac8517a38a473dc93938b9f38d5341	2026-08-09 19:02:31.955252+02	20260809170231_moderation_comments	\N	\N	2026-08-09 19:02:31.951713+02	1
fae1a50e-b12f-4e51-80e7-9afecb730bc8	0234ff1eedd968e60f1f219b0852b16a4f92c816b137539a989d7088475b2b68	2026-08-09 19:19:19.078641+02	20260809171919_rename_reader_identity	\N	\N	2026-08-09 19:19:19.056838+02	1
a937e8d6-7bb5-4a3f-b0e6-9072a7dacce9	275bc5ef6cbdd852eb95db075ba1e5ee24f453c6585730cbb46563278ec7e2c0	2026-08-09 19:28:13.759819+02	20260809172813_rehash_reader_identity	\N	\N	2026-08-09 19:28:13.748279+02	1
7a59a1bc-e975-4503-a389-a552eb57104f	ae00fcb8ffe40f180da0564985ac4f2f6671a318ddb5daf1a319f03e8229b482	2026-08-09 20:45:42.55025+02	20260809184542_add_media_assets	\N	\N	2026-08-09 20:45:42.538489+02	1
32d341dd-0f07-4858-835e-22e2fa77f082	e957137c3121791d42554c6bff566d7a192689d39410bdfca66e8c67634d7cc7	2026-08-09 21:07:41.587579+02	20260809190741_fix_media_assets	\N	\N	2026-08-09 21:07:41.586359+02	1
92c4f077-43f4-4872-833a-a2fe61fc2dcd	853dd23ec0c86d8272d2fdbe1416c266f597dd9e7b7a3bcedbd7cf44b142f243	2026-08-09 22:27:00.168434+02	20260809202700_added_quiz_gamification	\N	\N	2026-08-09 22:27:00.156765+02	1
b92abab5-f88d-4ae4-8293-591be2666b14	265ddfed0db43aaddd3ca25a5067552eb48d8431dcbfbd002004d75998d8139b	2026-08-09 23:20:14.443088+02	20260809212014_add_quiz_sessions	\N	\N	2026-08-09 23:20:14.43658+02	1
ba6151b0-2292-4336-8ecd-7cadc520ca97	f520975822c66cce577d56ec421e8f54129aeac3cfe6868d20d3daf9afd6649a	2026-08-10 00:14:50.666698+02	20260809221450_update_quiz_sessions	\N	\N	2026-08-10 00:14:50.659061+02	1
\.


--
-- Name: Achievement Achievement_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Achievement"
    ADD CONSTRAINT "Achievement_pkey" PRIMARY KEY (id);


--
-- Name: ArticleBlock ArticleBlock_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ArticleBlock"
    ADD CONSTRAINT "ArticleBlock_pkey" PRIMARY KEY (id);


--
-- Name: ArticleCategory ArticleCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ArticleCategory"
    ADD CONSTRAINT "ArticleCategory_pkey" PRIMARY KEY ("articleId", "categoryId");


--
-- Name: ArticleQuiz ArticleQuiz_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ArticleQuiz"
    ADD CONSTRAINT "ArticleQuiz_pkey" PRIMARY KEY (id);


--
-- Name: ArticleRevision ArticleRevision_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ArticleRevision"
    ADD CONSTRAINT "ArticleRevision_pkey" PRIMARY KEY (id);


--
-- Name: ArticleTag ArticleTag_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ArticleTag"
    ADD CONSTRAINT "ArticleTag_pkey" PRIMARY KEY ("articleId", "tagId");


--
-- Name: Article Article_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: MagazineIssue MagazineIssue_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."MagazineIssue"
    ADD CONSTRAINT "MagazineIssue_pkey" PRIMARY KEY (id);


--
-- Name: MagazinePage MagazinePage_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."MagazinePage"
    ADD CONSTRAINT "MagazinePage_pkey" PRIMARY KEY (id);


--
-- Name: MediaAsset MediaAsset_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."MediaAsset"
    ADD CONSTRAINT "MediaAsset_pkey" PRIMARY KEY (id);


--
-- Name: PointsTransaction PointsTransaction_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."PointsTransaction"
    ADD CONSTRAINT "PointsTransaction_pkey" PRIMARY KEY (id);


--
-- Name: QuizAnswer QuizAnswer_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."QuizAnswer"
    ADD CONSTRAINT "QuizAnswer_pkey" PRIMARY KEY (id);


--
-- Name: QuizAttempt QuizAttempt_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."QuizAttempt"
    ADD CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY (id);


--
-- Name: QuizOption QuizOption_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."QuizOption"
    ADD CONSTRAINT "QuizOption_pkey" PRIMARY KEY (id);


--
-- Name: QuizQuestion QuizQuestion_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."QuizQuestion"
    ADD CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY (id);


--
-- Name: QuizSessionQuestion QuizSessionQuestion_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."QuizSessionQuestion"
    ADD CONSTRAINT "QuizSessionQuestion_pkey" PRIMARY KEY (id);


--
-- Name: QuizSession QuizSession_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."QuizSession"
    ADD CONSTRAINT "QuizSession_pkey" PRIMARY KEY (id);


--
-- Name: ReaderAchievement ReaderAchievement_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ReaderAchievement"
    ADD CONSTRAINT "ReaderAchievement_pkey" PRIMARY KEY (id);


--
-- Name: ReaderEvent ReaderEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ReaderEvent"
    ADD CONSTRAINT "ReaderEvent_pkey" PRIMARY KEY (id);


--
-- Name: ReadingProgress ReadingProgress_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ReadingProgress"
    ADD CONSTRAINT "ReadingProgress_pkey" PRIMARY KEY (id);


--
-- Name: Tag Tag_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Achievement_code_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "Achievement_code_key" ON public."Achievement" USING btree (code);


--
-- Name: ArticleBlock_articleId_position_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "ArticleBlock_articleId_position_idx" ON public."ArticleBlock" USING btree ("articleId", "position");


--
-- Name: ArticleCategory_categoryId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "ArticleCategory_categoryId_idx" ON public."ArticleCategory" USING btree ("categoryId");


--
-- Name: ArticleQuiz_articleId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "ArticleQuiz_articleId_key" ON public."ArticleQuiz" USING btree ("articleId");


--
-- Name: ArticleRevision_articleId_version_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "ArticleRevision_articleId_version_key" ON public."ArticleRevision" USING btree ("articleId", version);


--
-- Name: ArticleRevision_createdById_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "ArticleRevision_createdById_idx" ON public."ArticleRevision" USING btree ("createdById");


--
-- Name: ArticleTag_tagId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "ArticleTag_tagId_idx" ON public."ArticleTag" USING btree ("tagId");


--
-- Name: Article_authorId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "Article_authorId_idx" ON public."Article" USING btree ("authorId");


--
-- Name: Article_publishedAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "Article_publishedAt_idx" ON public."Article" USING btree ("publishedAt");


--
-- Name: Article_slug_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "Article_slug_key" ON public."Article" USING btree (slug);


--
-- Name: Article_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "Article_status_idx" ON public."Article" USING btree (status);


--
-- Name: Category_slug_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "Category_slug_key" ON public."Category" USING btree (slug);


--
-- Name: MagazineIssue_publishedAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "MagazineIssue_publishedAt_idx" ON public."MagazineIssue" USING btree ("publishedAt");


--
-- Name: MagazineIssue_slug_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "MagazineIssue_slug_key" ON public."MagazineIssue" USING btree (slug);


--
-- Name: MagazinePage_articleId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "MagazinePage_articleId_idx" ON public."MagazinePage" USING btree ("articleId");


--
-- Name: MagazinePage_issueId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "MagazinePage_issueId_idx" ON public."MagazinePage" USING btree ("issueId");


--
-- Name: MagazinePage_issueId_position_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "MagazinePage_issueId_position_key" ON public."MagazinePage" USING btree ("issueId", "position");


--
-- Name: PointsTransaction_createdAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "PointsTransaction_createdAt_idx" ON public."PointsTransaction" USING btree ("createdAt");


--
-- Name: PointsTransaction_userId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "PointsTransaction_userId_idx" ON public."PointsTransaction" USING btree ("userId");


--
-- Name: QuizAnswer_attemptId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "QuizAnswer_attemptId_idx" ON public."QuizAnswer" USING btree ("attemptId");


--
-- Name: QuizAnswer_questionId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "QuizAnswer_questionId_idx" ON public."QuizAnswer" USING btree ("questionId");


--
-- Name: QuizAttempt_quizId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "QuizAttempt_quizId_idx" ON public."QuizAttempt" USING btree ("quizId");


--
-- Name: QuizAttempt_userId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "QuizAttempt_userId_idx" ON public."QuizAttempt" USING btree ("userId");


--
-- Name: QuizOption_questionId_position_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "QuizOption_questionId_position_idx" ON public."QuizOption" USING btree ("questionId", "position");


--
-- Name: QuizQuestion_quizId_position_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "QuizQuestion_quizId_position_idx" ON public."QuizQuestion" USING btree ("quizId", "position");


--
-- Name: QuizSessionQuestion_questionId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "QuizSessionQuestion_questionId_idx" ON public."QuizSessionQuestion" USING btree ("questionId");


--
-- Name: QuizSessionQuestion_sessionId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "QuizSessionQuestion_sessionId_idx" ON public."QuizSessionQuestion" USING btree ("sessionId");


--
-- Name: QuizSessionQuestion_sessionId_questionId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "QuizSessionQuestion_sessionId_questionId_key" ON public."QuizSessionQuestion" USING btree ("sessionId", "questionId");


--
-- Name: QuizSession_quizId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "QuizSession_quizId_idx" ON public."QuizSession" USING btree ("quizId");


--
-- Name: QuizSession_userId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "QuizSession_userId_idx" ON public."QuizSession" USING btree ("userId");


--
-- Name: ReaderAchievement_userId_achievementId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "ReaderAchievement_userId_achievementId_key" ON public."ReaderAchievement" USING btree ("userId", "achievementId");


--
-- Name: ReaderEvent_createdAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "ReaderEvent_createdAt_idx" ON public."ReaderEvent" USING btree ("createdAt");


--
-- Name: ReaderEvent_type_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "ReaderEvent_type_idx" ON public."ReaderEvent" USING btree (type);


--
-- Name: ReaderEvent_userId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "ReaderEvent_userId_idx" ON public."ReaderEvent" USING btree ("userId");


--
-- Name: ReadingProgress_articleId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "ReadingProgress_articleId_idx" ON public."ReadingProgress" USING btree ("articleId");


--
-- Name: ReadingProgress_userId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "ReadingProgress_userId_idx" ON public."ReadingProgress" USING btree ("userId");


--
-- Name: Tag_name_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "Tag_name_key" ON public."Tag" USING btree (name);


--
-- Name: Tag_slug_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "Tag_slug_key" ON public."Tag" USING btree (slug);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_readerTokenHash_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "User_readerTokenHash_key" ON public."User" USING btree ("readerTokenHash");


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: ArticleBlock ArticleBlock_articleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ArticleBlock"
    ADD CONSTRAINT "ArticleBlock_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES public."Article"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ArticleBlock ArticleBlock_mediaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ArticleBlock"
    ADD CONSTRAINT "ArticleBlock_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES public."MediaAsset"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ArticleCategory ArticleCategory_articleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ArticleCategory"
    ADD CONSTRAINT "ArticleCategory_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES public."Article"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ArticleCategory ArticleCategory_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ArticleCategory"
    ADD CONSTRAINT "ArticleCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ArticleQuiz ArticleQuiz_articleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ArticleQuiz"
    ADD CONSTRAINT "ArticleQuiz_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES public."Article"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ArticleRevision ArticleRevision_articleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ArticleRevision"
    ADD CONSTRAINT "ArticleRevision_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES public."Article"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ArticleRevision ArticleRevision_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ArticleRevision"
    ADD CONSTRAINT "ArticleRevision_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ArticleTag ArticleTag_articleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ArticleTag"
    ADD CONSTRAINT "ArticleTag_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES public."Article"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ArticleTag ArticleTag_tagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ArticleTag"
    ADD CONSTRAINT "ArticleTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES public."Tag"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Article Article_approvedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Article Article_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Article Article_publishedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_publishedById_fkey" FOREIGN KEY ("publishedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MagazinePage MagazinePage_articleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."MagazinePage"
    ADD CONSTRAINT "MagazinePage_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES public."Article"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MagazinePage MagazinePage_issueId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."MagazinePage"
    ADD CONSTRAINT "MagazinePage_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES public."MagazineIssue"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PointsTransaction PointsTransaction_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."PointsTransaction"
    ADD CONSTRAINT "PointsTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: QuizAnswer QuizAnswer_attemptId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."QuizAnswer"
    ADD CONSTRAINT "QuizAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES public."QuizAttempt"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuizAnswer QuizAnswer_optionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."QuizAnswer"
    ADD CONSTRAINT "QuizAnswer_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES public."QuizOption"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: QuizAnswer QuizAnswer_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."QuizAnswer"
    ADD CONSTRAINT "QuizAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."QuizQuestion"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: QuizAttempt QuizAttempt_quizId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."QuizAttempt"
    ADD CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES public."ArticleQuiz"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuizAttempt QuizAttempt_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."QuizAttempt"
    ADD CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: QuizOption QuizOption_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."QuizOption"
    ADD CONSTRAINT "QuizOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."QuizQuestion"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuizQuestion QuizQuestion_quizId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."QuizQuestion"
    ADD CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES public."ArticleQuiz"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuizSessionQuestion QuizSessionQuestion_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."QuizSessionQuestion"
    ADD CONSTRAINT "QuizSessionQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."QuizQuestion"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: QuizSessionQuestion QuizSessionQuestion_sessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."QuizSessionQuestion"
    ADD CONSTRAINT "QuizSessionQuestion_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."QuizSession"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuizSession QuizSession_quizId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."QuizSession"
    ADD CONSTRAINT "QuizSession_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES public."ArticleQuiz"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuizSession QuizSession_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."QuizSession"
    ADD CONSTRAINT "QuizSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ReaderAchievement ReaderAchievement_achievementId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ReaderAchievement"
    ADD CONSTRAINT "ReaderAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES public."Achievement"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ReaderAchievement ReaderAchievement_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ReaderAchievement"
    ADD CONSTRAINT "ReaderAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ReaderEvent ReaderEvent_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ReaderEvent"
    ADD CONSTRAINT "ReaderEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ReadingProgress ReadingProgress_articleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ReadingProgress"
    ADD CONSTRAINT "ReadingProgress_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES public."Article"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ReadingProgress ReadingProgress_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ReadingProgress"
    ADD CONSTRAINT "ReadingProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: thomastemp
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

