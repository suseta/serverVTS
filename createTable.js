const { Client } = require('pg');

const createDatabase = async (database) => {
    const connectionString = `postgresql://postgres:root@localhost:5432/`;
    let client = new Client({
        connectionString,
    });

    await client.connect();
    try {
        await client.query(`CREATE DATABASE ${database}`);
        console.log(`Database "${database}" created successfully.`);
    } catch (error) {
        console.error('Error creating database:', error.message);
    } finally {
        await client.end();
    }
}
async function userDetails(database){
      const connectionString = `postgresql://postgres:root@localhost:5432/${database}`;
      let client = new Client({
	connectionString,
      });
      await client.connect();
      try {
	  const query = `
	      CREATE TABLE IF NOT EXISTS user_details (
		  user_id int PRIMARY KEY,
                  transporter_id varchar(10) NOT NULL,
		  username varchar(30) NOT NULL,
		  password varchar(30) NOT NULL ,
		  user_email varchar(50) NOT NULL,
		  user_created_on TIMESTAMP NOT NULL,
		  user_last_login TIMESTAMP
	      );
          `;
             await client.query(query);
             console.log('Table created successfully');  
          } catch(error){
	     console.error('Error creating table:', error);
	} finally {
	if (client._ending) {
            console.error('Error: Connection already closed.');
        } else {
            await client.end();
        }
    }
}

async function entityDetails(database){
      const connectionString = `postgresql://postgres:root@localhost:5432/${database}`;
      let client = new Client({
        connectionString,
      });
      await client.connect();
      try {
          const query = `
              CREATE TABLE IF NOT EXISTS entity_details (
                  s_entity_id VARCHAR(10) PRIMARY KEY,
                  s_entity_name VARCHAR(50),
		  s_entity_type VARCHAR(10),
                  s_transporter_id VARCHAR(10),
                  s_transporter_name VARCHAR(50),
                  s_customer_id VARCHAR(10),
                  s_customer_name VARCHAR(50),
                  s_customer_type VARCHAR(20),
		  s_parent_entity_id VARCHAR(10),
		  s_immediate_parent_entity_name VARCHAR(50),
                  i_user_id INT,
		  s_user_type VARCHAR(10)
                );
          `;
             await client.query(query);
             console.log('Table created successfully');  
          } catch(error){
             console.error('Error creating table:', error);
        } finally {
        if (client._ending) {
            console.error('Error: Connection already closed.');
        } else {
            await client.end();
        }
    }
}

async function subEntityDetails(database){
      const connectionString = `postgresql://postgres:root@localhost:5432/${database}`;
      let client = new Client({
        connectionString,
      });
      await client.connect();
      try {
          const query = `
              CREATE TABLE IF NOT EXISTS sub_entity_details (
                  s_sub_entity_id VARCHAR(10) PRIMARY KEY,
                  s_sub_entity_name VARCHAR(50),
                  s_sub_entity_type VARCHAR(10),
		  s_entity_id VARCHAR(10) NOT NULL,
                  s_entity_name VARCHAR(50),
                  s_entity_type VARCHAR(10),
                  s_transporter_id VARCHAR(10),
                  s_transporter_name VARCHAR(50),
                  s_customer_id VARCHAR(10),
                  s_customer_name VARCHAR(50),
                  s_customer_type VARCHAR(20),
                  s_parent_entity_id VARCHAR(10),
                  s_immediate_parent_entity_name VARCHAR(50),
                  i_user_id INT,
                  s_user_type VARCHAR(10)
                );
          `;
             await client.query(query);
             console.log('Table created successfully');  
          } catch(error){
             console.error('Error creating table:', error);
        } finally {
        if (client._ending) {
            console.error('Error: Connection already closed.');
        } else {
            await client.end();
        }
    }
}

async function deviceDetails(database){
      const connectionString = `postgresql://postgres:root@localhost:5432/${database}`;
      let client = new Client({
        connectionString,
      });
      await client.connect();
      try {
          const query = `
              CREATE TABLE IF NOT EXISTS device_details (
                  s_device_id VARCHAR(10) PRIMARY KEY,
                  device_active_status VARCHAR(10),
		  device_info VARCHAR(50),
		  device_last_update_timestamp TIMESTAMP,
		  device_type VARCHAR(10),
		  device_model VARCHAR(20),
		  device_manufacturer VARCHAR(50),
		  firmware_version VARCHAR(10),
		  fuel_data BOOLEAN,
		  temperature_data BOOLEAN,
		  RFID_data BOOLEAN
              );
          `;
             await client.query(query);
	     console.log('Table created successfully');  
          } catch(error){
             console.error('Error creating table:', error);
        } finally {
        if (client._ending) {
            console.error('Error: Connection already closed.');
        } else {
            await client.end();
        }
    }
}

async function locationDetails(database){
      const connectionString = `postgresql://postgres:root@localhost:5432/${database}`;
      let client = new Client({
        connectionString,
      });
      await client.connect();
      try {
          const query = `
              CREATE TABLE IF NOT EXISTS location_details (
                  location_name VARCHAR(50),
		  location_pincode VARCHAR(10) PRIMARY KEY,
		  s_entity_id VARCHAR(10),
		  s_entity_name VARCHAR(50),
		  s_transporter_id VARCHAR(10),
		  s_transporter_name VARCHAR(50),
		  s_customer_id VARCHAR(10),
		  s_customer_name VARCHAR(50),
		  s_customer_type VARCHAR(20),
		  i_user_id INT,
		  s_user_type VARCHAR(10)
	 	);
          `;
             await client.query(query);
             console.log('Table created successfully');  
          } catch(error){
             console.error('Error creating table:', error);
        } finally {
        if (client._ending) {
            console.error('Error: Connection already closed.');
        } else {
            await client.end();
        }
    }
}

async function transporterDetails(database){
      const connectionString = `postgresql://postgres:root@localhost:5432/${database}`;
      let client = new Client({
        connectionString,
      });
      await client.connect();
      try {
          const query = `
              CREATE TABLE IF NOT EXISTS transporter_details (
                  s_transporter_id VARCHAR(10) PRIMARY KEY,
                  s_transporter_name VARCHAR(50),
                  s_entity_id VARCHAR(10),
                  s_entity_name VARCHAR(50),
                  s_customer_id VARCHAR(10),
                  s_customer_name VARCHAR(50),
                  s_customer_type VARCHAR(20),
                  i_user_id INT,
		  s_user_type VARCHAR(10)
                );
          `;
             await client.query(query);
             console.log('Table created successfully');  
          } catch(error){
             console.error('Error creating table:', error);
        } finally {
        if (client._ending) {
            console.error('Error: Connection already closed.');
        } else {
            await client.end();
        }
    }
}

async function consigneeDetails(database){
      const connectionString = `postgresql://postgres:root@localhost:5432/${database}`;
      let client = new Client({
        connectionString,
      });
      await client.connect();
      try {
          const query = `
              CREATE TABLE IF NOT EXISTS consignee_details (
                  s_entity_id VARCHAR(10) NOT NULL,
                  s_entity_name VARCHAR(50),
		  s_transporter_id VARCHAR(10),
		  s_consignee_name VARCHAR(50),
		  s_consignee_id VARCHAR(50) PRIMARY KEY,
		  start_point VARCHAR(50),
		  destination VARCHAR(50),
		  latitude DOUBLE PRECISION,
		  latitude_direction VARCHAR(10),
		  longitude DOUBLE PRECISION,
		  longitude_direction VARCHAR(10),
		  radius DOUBLE  PRECISION,
		  contact_person VARCHAR(50),
		  contact_no NUMERIC(12)
              );
          `;
             await client.query(query);
	     console.log('Table created successfully');  
          } catch(error){
             console.error('Error creating table:', error);
        } finally {
        if (client._ending) {
            console.error('Error: Connection already closed.');
        } else {
            await client.end();
        }
    }
}

async function consignorDetails(database){
      const connectionString = `postgresql://postgres:root@localhost:5432/${database}`;
      let client = new Client({
        connectionString,
      });
      await client.connect();
      try {
          const query = `
              CREATE TABLE IF NOT EXISTS consignor_details (
                  s_entity_id VARCHAR(10) NOT NULL,
                  s_entity_name VARCHAR(50),
		  s_transporter_id VARCHAR(10),
                  s_consignor_name VARCHAR(50),
                  s_consignor_id VARCHAR(50) PRIMARY KEY,
                  start_point VARCHAR(50),
                  destination VARCHAR(50),
                  latitude DOUBLE PRECISION,
                  latitude_direction VARCHAR(10),
                  longitude DOUBLE PRECISION,
                  longitude_direction VARCHAR(10),
		  radius DOUBLE PRECISION,
                  contact_person VARCHAR(50),
                  contact_no NUMERIC(12)
              );
          `;
             await client.query(query);
             console.log('Table created successfully');  
          } catch(error){
             console.error('Error creating table:', error);
        } finally {
        if (client._ending) {
            console.error('Error: Connection already closed.');
        } else {
            await client.end();
        }
    }
}

async function customerDetails(database){
      const connectionString = `postgresql://postgres:root@localhost:5432/${database}`;
      let client = new Client({
        connectionString,
      });
      await client.connect();
      try {
          const query = `
              CREATE TABLE IF NOT EXISTS customer_details (
                  s_entity_id VARCHAR(10) NOT NULL,
                  s_entity_name VARCHAR(50),
		  s_transporter_id VARCHAR(10) NOT NULL,
                  s_consignee_name VARCHAR(50),
                  s_consignee_id VARCHAR(50) NOT NULL,
                  s_customer_id VARCHAR(10) PRIMARY KEY,
		  s_customer_name VARCHAR(50),
		  i_user_id INT,
		  customer_type_name VARCHAR(10),
		  customer_active_status CHAR(2)
              );
          `;
             await client.query(query);
             console.log('Table created successfully');  
          } catch(error){
             console.error('Error creating table:', error);
        } finally {
        if (client._ending) {
            console.error('Error: Connection already closed.');
        } else {
            await client.end();
        }
    }
}

async function driverDetails(database){
      const connectionString = `postgresql://postgres:root@localhost:5432/${database}`;
      let client = new Client({
        connectionString,
      });
      await client.connect();
      try {
          const query = `
              CREATE TABLE IF NOT EXISTS driver_details (
                  s_driver_id VARCHAR(10) PRIMARY KEY,
		  s_driver_img_path VARCHAR(80),
		  s_license_img_path VARCHAR(80),
		  s_entity_name VARCHAR(50),
		  s_driver_name VARCHAR(50),
		  i_mobile_no NUMERIC(12),
		  s_driver_address VARCHAR(255),
		  s_license_no VARCHAR(16),
		  s_driver_city VARCHAR(30),
		  i_driver_pincode NUMERIC(6),
		  license_validity_date TIMESTAMP,
		  s_smart_card_no VARCHAR(16),
		  s_state_name VARCHAR(30),
		  s_country_name VARCHAR(30),
		  s_hazard_certificate VARCHAR(20),
		  hazard_validity_date TIMESTAMP,
		  medical_test_date TIMESTAMP,
		  product_training_date TIMESTAMP,
		  driver_active_status VARCHAR(10),
		  s_remarks VARCHAR(255),
		  ddt_expiry_date TIMESTAMP,
		  cab_validity_date TIMESTAMP,
		  s_license_verification_covid VARCHAR(10)
              );
          `;
             await client.query(query);
	    console.log('Table created successfully');  
          } catch(error){
             console.error('Error creating table:', error);
        } finally {
        if (client._ending) {
            console.error('Error: Connection already closed.');
        } else {
            await client.end();
        }
    }
}

async function assetDetails(database){
      const connectionString = `postgresql://postgres:root@localhost:5432/${database}`;
  let client = new Client({
        connectionString,
           ssl: false,
    });
    await client.connect();
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS asset_details (
                s_entity_identity VARCHAR(50) NOT NULL,
                s_transporter_id VARCHAR(10),
                s_asset_id VARCHAR(10) PRIMARY KEY,
		s_asset_name VARCHAR(30),
		imei_number VARCHAR(20),
		s_asset_type VARCHAR(10) NOT NULL,
		i_tare_weight INT,
		i_gross_weight INT,
		s_asset_model VARCHAR(30),
		vahan_update_date TIMESTAMP,
		capacity_name VARCHAR(10),
		s_vendor_name VARCHAR(30),
		registration_date TIMESTAMP,
		mfg_dt TIMESTAMP,
		rc_validity_date TIMESTAMP,
		gate_pass TIMESTAMP,
		fitness_certificate_date TIMESTAMP,
		polution_certificate_date TIMESTAMP,
		isurance_validity_date TIMESTAMP,
		state_permit_date TIMESTAMP,
		international_permit_date TIMESTAMP,
		goods_permit_date TIMESTAMP,
		road_permit_date TIMESTAMP,
		battery_purchase_date TIMESTAMP,
		battery_expiry_date TIMESTAMP,
		i_standard_km INT,
		peso_license_date TIMESTAMP,
		rule_18 TIMESTAMP,
		rule_19 TIMESTAMP,
		s_driver_name VARCHAR(50),
		s_billing_remark VARCHAR(255),
		s_customer_remark VARCHAR(255),
		s_fnd_device_id VARCHAR(20),
		s_site_location VARCHAR(80),
		s_national_certificate_no VARCHAR(30),
		national_test_date TIMESTAMP,
		national_validity_date TIMESTAMP,
		vehicle_active_status CHAR(2),
		i_seating_capacity INT
            );
        `;
        await client.query(query);
        console.log('Table created successfully');
    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
if (client._ending) {
            console.error('Error: Connection already closed.');
        } else {
            await client.end();
        }
    }
}

async function dataLog(database) {
//    const connectionString = `postgresql://postgres:root@localhost:5432/${database}`;
      const connectionString = `postgresql://postgres:postgres@postgres-db.cahr3oxezjyh.ap-south-1.rds.amazonaws.com:5432/vtsdb`;
//    const connectionString = 'postgresql://postgres:postgres@postgres-db.cahr3oxezjyh.ap-south-1.rds.amazonaws.com:5432/vtsdb?ssl=false';
  
  let client = new Client({
        connectionString,
           ssl: false,
    });
    await client.connect();
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS datalog (
                rawpacket varchar(100000) PRIMARY KEY,
                serverhittimestamp TIMESTAMP,
                status SMALLINT
            );
        `;
        await client.query(query);
        console.log('Table created successfully');
    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
if (client._ending) {
            console.error('Error: Connection already closed.');
        } else {
            await client.end();
        }
    }
}


/*
async function dataLog(database) {
    const pool = new Pool({
        user: 'postgres',
        host: 'postgres-db.cahr3oxezjyh.ap-south-1.rds.amazonaws.com',
        database: 'vtsdb',
        password: 'postgres',
        port: 5432,
    });

    try {
        const query = `
            CREATE TABLE IF NOT EXISTS datalog (
                rawpacket varchar(100000) PRIMARY KEY,
                serverhittimestamp TIMESTAMP,
                status SMALLINT
            );
        `;

        const client = await pool.connect();
        await client.query(query);
        console.log('Table created successfully');
    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
        await pool.end();
    }
}

// Call the function
dataLog('vtsdb').catch((error) => {
    console.error('Unhandled promise rejection:', error);
    process.exit(1); // Optionally terminate the process on unhandled rejection
});
*/

async function assetDeviceMapping(database) {
    const connectionString = `postgresql://postgres:root@localhost:5432/${database}`;
    let client = new Client({
        connectionString,
    });
    await client.connect();
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS asset_device_mapping (
                assetid varchar(10),
                imeino varchar(20),
status BOOLEAN DEFAULT false,
                PRIMARY KEY (assetid, imeino)
            );
        `;
        await client.query(query);
        console.log('Table created successfully');
    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
        if (client._ending) {
            console.error('Error: Connection already closed.');
        } else {
            await client.end();
        }
    }
}

async function gpsDeviceData(database) {
    const connectionString = `postgresql://postgres:root@localhost:5432/${database}`;
let client = new Client({
        connectionString,
    });
    await client.connect();
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS gps_device_data (
            start_char CHAR,
            packet_header VARCHAR(20),
            firmware_version VARCHAR(20),
            packet_type VARCHAR(20),
            packet_status VARCHAR(7),
            imei_number VARCHAR(16),
            vehicle_number VARCHAR(25) DEFAULT NULL,
            gps_status SMALLINT,
            gps_date DATE,
            gps_time TIME,
            latitude DOUBLE PRECISION,
            latitude_direction VARCHAR(6),
	    longitude DOUBLE PRECISION,
            longitude_direction VARCHAR(6),
            altitude DOUBLE PRECISION,
            speed FLOAT,
            ground_course NUMERIC,
            satellite_count INT,
            hdop FLOAT,
            pdop FLOAT,
            network_operator VARCHAR(30),
            network_type VARCHAR(20),
            signal_power FLOAT,
            main_power FLOAT,
            internal_battery_voltage FLOAT,
            ignition_input VARCHAR(10),
            buzzer_output VARCHAR(10),
            dynamic_field_1 VARCHAR(80),
            bt_field VARCHAR(80),
            u_art VARCHAR(80),
            exact_adc_value VARCHAR(10),
 	    device_state VARCHAR(10),
            odometer VARCHAR(10),
            packet_count VARCHAR(30),
            crc VARCHAR(20),
            last_char CHAR
        );
        `;
        await client.query(query);
        console.log('Table created successfully');
    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
        if (client._ending) {
            console.error('Error: Connection already closed.');
        } else {
            await client.end();
        }
    }
}

async function waypointDetails(database){
    const connectionString = `postgresql://postgres:root@localhost:5432/${database}`;
    const client = new Client({
        connectionString,
    });

    try {
        await client.connect();

        const query = `
            CREATE TABLE IF NOT EXISTS waypoint_details (
                s_asset_id VARCHAR(10) PRIMARY KEY,
                s_asset_type VARCHAR(30),
                s_entity_id VARCHAR(10),
                s_entity_name VARCHAR(50),
                s_entity_type VARCHAR(10),
                s_consignor_id VARCHAR(10),
                s_consignor_name VARCHAR(50),
                s_transporter_id VARCHAR(10),
                s_transporter_name VARCHAR(50),
                s_driver_id VARCHAR(10),
                s_driver_name VARCHAR(30),
                waypoint_1 VARCHAR(50),
                waypoint_2 VARCHAR(50),
                speed INT,
                distance FLOAT,
                asset_status_with_time VARCHAR(50),
                latitude DOUBLE PRECISION,
                latitude_direction VARCHAR(10),
                longitude DOUBLE PRECISION,
                longitude_direction VARCHAR(10),
                radius DOUBLE PRECISION,
                vehicle_start_date TIMESTAMP,
                s_remarks VARCHAR(255)
            );
        `;

        await client.query(query);
        console.log('Waypoint_details table created successfully');
    } catch (error) {
        console.error('Error creating waypoint_details table:', error);
    } finally {
        await client.end();
    }
}

// createDatabase("vtsdb");
// userDetails("vtsdb");
// entityDetails("vtsdb");
// subEntityDetails("vtsdb");
// locationDetails("vtsdb");
// transporterDetails("vtsdb");
// deviceDetails("vtsdb");
// consigneeDetails("vtsdb");
// consignorDetails("vtsdb");
// customerDetails("vtsdb");
// driverDetails("vtsdb");
 assetDetails("vtsdb");
// dataLog("vtsdb");
// assetDeviceMapping("vtsdb");
// gpsDeviceData("vtsdb");
// waypointDetails("vtsdb");
