import { Column, PrimaryColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

export abstract class BaseModel {
    @Exclude()
    @Column({ name: 'created_by', nullable: true })
    public createdBy: string;

    @Column({ name: 'created_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public createdDate: Date;

    @Exclude()
    @Column({ name: 'modified_by', nullable: true })
    public modifiedBy: string;

    @Column({ name: 'modified_date', type: 'timestamp', nullable: true })
    public modifiedDate: Date;
}
