import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTagsEntity1722517684916 implements MigrationInterface {
    name = 'AddTagsEntity1722517684916'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question_tags_tag" ("questionId" integer NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_91ee6aab8dabacfdc162a45e5d4" PRIMARY KEY ("questionId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fa1cf45c0ee075fd02b0009a0d" ON "question_tags_tag" ("questionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c92b89d6b96fe844dce95d4e4b" ON "question_tags_tag" ("tagId") `);
        await queryRunner.query(`ALTER TABLE "question_tags_tag" ADD CONSTRAINT "FK_fa1cf45c0ee075fd02b0009a0d4" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "question_tags_tag" ADD CONSTRAINT "FK_c92b89d6b96fe844dce95d4e4bd" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_tags_tag" DROP CONSTRAINT "FK_c92b89d6b96fe844dce95d4e4bd"`);
        await queryRunner.query(`ALTER TABLE "question_tags_tag" DROP CONSTRAINT "FK_fa1cf45c0ee075fd02b0009a0d4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c92b89d6b96fe844dce95d4e4b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fa1cf45c0ee075fd02b0009a0d"`);
        await queryRunner.query(`DROP TABLE "question_tags_tag"`);
        await queryRunner.query(`DROP TABLE "tag"`);
    }

}
