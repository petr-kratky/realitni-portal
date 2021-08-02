import {MigrationInterface, QueryRunner} from "typeorm";

export class users1627848458905 implements MigrationInterface {
    name = 'users1627848458905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "public"."users" ("user_id" SERIAL NOT NULL, "username" character varying(50) NOT NULL, "password" character varying(100) NOT NULL, "email" character varying(355) NOT NULL, "created_on" TIMESTAMP NOT NULL, "last_login" TIMESTAMP, "token_version" integer DEFAULT 0, CONSTRAINT "UQ_491a0f4ba25d0b13e5d8ac62d80" UNIQUE ("username"), CONSTRAINT "UQ_12ffa5c867f6bb71e2690a526ce" UNIQUE ("email"), CONSTRAINT "PK_f49901459f096082f5835adddfd" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "users_username_key" ON "public"."users" ("username") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "users_email_key" ON "public"."users" ("email") `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reality"."estate" DROP CONSTRAINT "FK_1583245e1fb9ef4e6488416499f"`);
        await queryRunner.query(`DROP INDEX "public"."users_email_key"`);
        await queryRunner.query(`DROP INDEX "public"."users_username_key"`);
        await queryRunner.query(`DROP TABLE "public"."users"`);
        await queryRunner.query(`DROP INDEX "reality"."estate_geom_idx"`);
        await queryRunner.query(`DROP INDEX "reality"."idx_20223_primary"`);
        await queryRunner.query(`DROP TABLE "reality"."estate"`);
        await queryRunner.query(`DROP INDEX "reality"."source_pkey"`);
        await queryRunner.query(`DROP TABLE "reality"."source"`);
    }

}
