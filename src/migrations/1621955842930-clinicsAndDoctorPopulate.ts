import { MigrationInterface, QueryRunner } from "typeorm";

export class clinicsAndDoctorPopulate1621955842930 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Clinic seed
        await queryRunner.query(`INSERT INTO clinics (id, name, phone, address) VALUES (uuid_generate_v4(), 'Universidade Federal do Rio de Janeiro', '(21) 1234-5678', 'Av. Pedro Calmon, 550')`); 
        await queryRunner.query(`INSERT INTO clinics (id, name, phone, address) VALUES (uuid_generate_v4(), 'Universidade Federal de São Paulo', '(11) 8765-4321', 'R. Sena Madureira, 1500')`);
        await queryRunner.query(`INSERT INTO clinics (id, name, phone, address) VALUES (uuid_generate_v4(), 'Universidade Federal de Minas Gerais', '(31) 9876-5432', 'Av. Antônio Carlos, 6627')`);
        await queryRunner.query(`INSERT INTO clinics (id, name, phone, address) VALUES (uuid_generate_v4(), 'Universidade Federal do Ceará', '(85) 2345-6789', 'Av. da Universidade, 2853')`);
        await queryRunner.query(`INSERT INTO clinics (id, name, phone, address) VALUES (uuid_generate_v4(), 'Universidade Federal do Rio Grande do Sul', '(51) 3456-7890', 'Av. Paulo Gama, 110')`);
        await queryRunner.query(`INSERT INTO clinics (id, name, phone, address) VALUES (uuid_generate_v4(), 'Universidade Federal de Pernambuco', '(81) 5678-9012', 'Cidade Universitária, s/n')`);
        await queryRunner.query(`INSERT INTO clinics (id, name, phone, address) VALUES (uuid_generate_v4(), 'Universidade Federal de Viçosa', '(31) 2345-6789', 'Av. Peter Henry Rolfs, s/n')`);
        await queryRunner.query(`INSERT INTO clinics (id, name, phone, address) VALUES (uuid_generate_v4(), 'Universidade Federal do Paraná', '(41) 7890-1234', 'Rua XV de Novembro, 1299')`);
        await queryRunner.query(`INSERT INTO clinics (id, name, phone, address) VALUES (uuid_generate_v4(), 'Universidade Federal do Amazonas', '(92) 3456-7890', 'Av. Rodrigo Otávio, 6200')`);
        await queryRunner.query(`INSERT INTO clinics (id, name, phone, address) VALUES (uuid_generate_v4(), 'Universidade Federal de Goiás', '(62) 4567-8901', 'Campus Samambaia, s/n')`);

        // await queryRunner.query(`INSERT INTO clinics (id, name, phone, address) VALUES (uuid_generate_v4(), 'Clínica CSI', '(71) 3181-7666', 'R. Teixeira Barros, 27')`);
        // await queryRunner.query(`INSERT INTO clinics (id, name, phone, address) VALUES (uuid_generate_v4(), 'Clínica CAM Itaigara', '(71) 3352-8800', 'Ed. Prof. Carlos Aristides Maltez, Av. Antônio Carlos Magalhães, 237')`);
        // await queryRunner.query(`INSERT INTO clinics (id, name, phone, address) VALUES (uuid_generate_v4(), 'Clínica Imagem Médica', '(71) 3359-8600', 'Av. Antônio Carlos Magalhães, 585')`);
        // await queryRunner.query(`INSERT INTO clinics (id, name, phone, address) VALUES (uuid_generate_v4(), 'Clínica CDI', '(71) 3797-8500', 'Av. ACM, 1034')`);
        // await queryRunner.query(`INSERT INTO clinics (id, name, phone, address) VALUES (uuid_generate_v4(), 'Clínica Santa Helena', '(71) 3622-7555', 'Av. Tancredo Neves, 2227')`);
        // await queryRunner.query(`INSERT INTO clinics (id, name, phone, address) VALUES (uuid_generate_v4(), 'Clínica Humanizare', '(71) 99127-7010', 'R. Frederico Simões, 85')`);
        // await queryRunner.query(`INSERT INTO clinics (id, name, phone, address) VALUES (uuid_generate_v4(), 'Clínica FIPES', '(71) 3015-2005', 'Av. Tancredo Neves, 1632')`);
        // await queryRunner.query(`INSERT INTO clinics (id, name, phone, address) VALUES (uuid_generate_v4(), 'Clínica Apollo', '(71) 3341-0112', 'Av. Tancredo Neves, 2539')`);
        // await queryRunner.query(`INSERT INTO clinics (id, name, phone, address) VALUES (uuid_generate_v4(), 'Clínica Facilita', '(71) 2132-6140', 'Av. Antônio Carlos Magalhães, 3591')`);
        // await queryRunner.query(`INSERT INTO clinics (id, name, phone, address) VALUES (uuid_generate_v4(), 'Clínica OralFace', '(71) 3113-2390', 'Av. Tancredo Neves, 1610')`);
    
        //Doctor seed
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Lucas Costa Oliveira', '24899724055', '12345-BA', 'lucascostaoliveira@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Luís Melo Cavalcanti', '21475986076', '15507-BA', 'luismelocavalcanti@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Arthur Fernandes Costa', '62964884080', '366-BA', 'arthurfernandescosta@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Marina Azevedo Rocha', '77200621080', '21660-BA', 'marinaazevedorocha@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Erick Rodrigues Sousa', '63460572000', '34726-BA', 'erickrodriguessousa@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Bruna Pereira Ferreira', '47403778022', '1184-BA', 'brunapereiraferreira@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Ágatha Melo Pereira', '83774092087', '15745-BA', 'agathamelopereira@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Miguel Rocha Melo', '28049940071', '29132-BA', 'miguelrochamelo@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Camila Martins Azevedo', '07775062037', '5131-BA', 'camilamartinsazevedo@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Carla Alves Cunha', '19193449003', '1512-BA', 'carlaalvescunha@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Diego Pinto Araujo', '55293822071', '23613-BA', 'diegopintoaraujo@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Júlia Barros Fernandes', '51988312043', '8588-BA', 'juliabarrosfernandes@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Breno Oliveira Cardoso', '81313530018', '12566-BA', 'brenooliveiracardoso@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Camila Sousa Gomes', '53517652091', '5808-BA', 'camilasousagomes@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Sofia Goncalves Castro', '28561487003', '1254-BA', 'sofiagoncalvescastro@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Vinicius Ribeiro Correia', '00784288070', '8214-BA', 'viniciusribeirocorreia@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Larissa Martins Goncalves', '93384929071', '27213-BA', 'larissamartinsgoncalves@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Eduarda Barros Lima', '43592526090', '33902-BA', 'eduardabarroslima@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Daniel Dias Melo', '33007618088', '32311-BA', 'danieldiasmelo@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Arthur Martins Rocha', '43534532031', '26662-BA', 'arthurmartinsrocha@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'João Cunha Ribeiro', '54353484044', '9712-BA', 'joaocunharibeiro@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Lara Lima Correia', '23910758045', '5586-BA', 'laralimacorreia@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Miguel Rodrigues Correia', '97103130027', '36736-BA', 'miguelrodriguescorreia@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Júlio Pereira Araujo', '48783013091', '4163-BA', 'juliopereiraaraujo@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Emily Rocha Goncalves', '13103154003', '31151-BA', 'emilyrochagoncalves@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Victor Carvalho Dias', '66379614001', '16147-BA', 'victorcarvalhodias@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Vitória Goncalves Araujo', '44570655017', '18657-BA', 'vitoriagoncalvesaraujo@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Luana Ferreira Rocha', '48884156092', '6118-BA', 'luanaferreirarocha@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Luís Dias Goncalves', '13861821095', '5242-BA', 'luisdiasgoncalves@gmail.com')`);
        await queryRunner.query(`INSERT INTO doctors (id, name, document, crm, email) VALUES (uuid_generate_v4(), 'Danilo Lima Pinto', '81733616063', '23095-BA', 'danilolimapinto@gmail.com')`);
    
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM clinics`);
        await queryRunner.query(`DELETE FROM doctors`);
       
    }

}
