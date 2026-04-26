import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity('upload-file')
export class UploadFileEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: number;

    /* Оригинальное имя файла */
    @Column()
    public filename: string;

    /* Оригинальное имя файла (опциональное) */
    @Column()
    public originalName: string;

    /* Относительный или абсолютный путь */
    @Column()
    public path: string;

    /* Полный публичный URL (если генерируется отдельно) */
    @Column({nullable: true})
    public url: string;

    /* Тип файла */
    @Column()
    public mimetype: string;

    /* Размер в байтах */
    @Column({type: 'int'})
    public size: number;

    /* Для изображений – ширина */
    @Column({nullable: true})
    public width: number;

    /* Для изображений – высота */
    @Column({nullable: true})
    public height: number;

    /* Категория папки */
    @Column({nullable: true})
    public folder: string;

    /* Описание */
    @Column({nullable: true, type: 'text'})
    public description: string;

    /* Главное изображение (например, для товара) */
    @Column({default: false})
    public isMain: boolean;

    /* ID сущности */
    @Column({nullable: true})
    public entityId: number;

    /* Тип сущности */
    @Column({nullable: true})
    public entityType: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn({nullable: true})
    public updatedAt: Date;
}
