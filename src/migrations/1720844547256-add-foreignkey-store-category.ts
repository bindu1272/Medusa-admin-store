import { MigrationInterface, QueryRunner } from "typeorm";

export class AddForeignkeyStoreCategory1720844547256 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "ALTER TABLE \"product_category\" ADD CONSTRAINT \"FK_store_category_store_id\" FOREIGN KEY (\"store_id\") REFERENCES \"store\"(\"id\") ON DELETE CASCADE"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \"product_category\" DROP CONSTRAINT \"FK_store_category_store_id\"");
    }

}
