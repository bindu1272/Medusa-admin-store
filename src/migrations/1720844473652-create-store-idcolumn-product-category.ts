import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateStoreIdcolumnProductCategory1720844473652 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "product_category" ADD "store_id" character varying`
          )
          await queryRunner.query(
            `CREATE INDEX "ProductCategoryStoreId" ON "product_category" ("store_id")`
          )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP INDEX "public"."ProductCategoryStoreId"`
          )
          await queryRunner.query(
            `ALTER TABLE "product_category" DROP COLUMN "store_id"`
          )
    }

}
