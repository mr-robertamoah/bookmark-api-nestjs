import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import * as request from 'supertest';
import { AuthDto } from './../src/auth/dto';
import { User } from '@prisma/client';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let user: User;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();

    prisma = app.get(PrismaService);

    await prisma.cleanDb();
  });

  afterAll(() => {
    app.close();
  });

  const dto: AuthDto = {
    email: 'mr_robertamoah@gmail.com',
    password: '12345678',
  };

  describe('Auth', () => {
    describe('signup', () => {
      it('should sign up', () => {
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send(dto)
          .expect(201);
      });
    });

    describe('signin', () => {
      it('should sign in', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/signin')
          .send(dto)
          .expect(200);

        accessToken = res.body.access_token;

        expect(accessToken).not.toBeNull();
      });
    });
  });

  describe('User', () => {
    describe('Get access token', () => {
      it('get user access token', async () => {
        const res = await request(app.getHttpServer())
          .get('/user/me')
          .auth(accessToken, { type: 'bearer' })
          .expect(200);

        user = res.body;
        expect(user.email).toBe(dto.email);
      });
    });

    describe('Edit user', () => {
      it('edit user', async () => {
        const firstName: string = 'Robert';

        const res = await request(app.getHttpServer())
          .patch('/user')
          .auth(accessToken, { type: 'bearer' })
          .send({ firstName })
          .expect(201);

        expect(res.body.firstName).toBe(firstName);
      });
    });
  });

  describe('Bookmarks', () => {
    const bookmark = {
      link: 'www.facebook.com',
      title: 'facebook',
    };

    let bookmarkId: string;
    describe('Create', () => {
      it('valid user able to create bookmark', async () => {
        const res = await request(app.getHttpServer())
          .post('/bookmarks')
          .auth(accessToken, { type: 'bearer' })
          .send(bookmark)
          .expect(201);

        expect(res.body.link).toBe(bookmark.link);
        expect(res.body.title).toBe(bookmark.title);

        bookmarkId = res.body.id;
      });
    });

    describe('Edit', () => {
      it('valid user able to update bookmark', async () => {
        const res = await request(app.getHttpServer())
          .patch(`/bookmarks/${bookmarkId}`)
          .auth(accessToken, { type: 'bearer' })
          .send({ ...bookmark, link: 'https://facebook.com' })
          .expect(201);

        expect(res.body.link).not.toBe(bookmark.link);
        expect(res.body.title).toBe(bookmark.title);
      });
    });

    describe('Get bookmark by id', () => {
      it('valid user able to get bookmark by id', async () => {
        const res = await request(app.getHttpServer())
          .get(`/bookmarks/${bookmarkId}`)
          .auth(accessToken, { type: 'bearer' })
          .expect(200);

        expect(res.body.title).toBe(bookmark.title);
      });
    });

    describe('Get bookmarks', () => {
      it('able to get bookmarks', async () => {
        const res = await request(app.getHttpServer())
          .get('/bookmarks')
          .auth(accessToken, { type: 'bearer' })
          .expect(200);

        expect(res.body).toHaveLength(1);
      });
    });

    describe('Delete', () => {
      it('valid user able to delete bookmark by id', () => {
        request(app.getHttpServer())
          .patch(`/bookmarks/${bookmarkId}`)
          .auth(accessToken, { type: 'bearer' })
          .expect(204);
      });
    });
  });
});
