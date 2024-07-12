import { MigrationInterface, QueryRunner } from "typeorm"

export class AddUserStoreRelation1720689226391 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "ALTER TABLE \"user\" ADD CONSTRAINT \"FK_fab5f83a1cc8ebe0076c733fd85\" FOREIGN KEY (\"store_id\") REFERENCES \"store\"(\"id\") ON DELETE CASCADE"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \"user\" DROP CONSTRAINT \"FK_fab5f83a1cc8ebe0076c733fd85\"");

    }

}
