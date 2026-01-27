import 'dotenv/config';
import pg from 'pg';


const {Pool} = pg;

const pool = new Pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'blog',
    password: '140510Oe',
    port: 5432,
});


pool.connect().then(()=> 
    console.log('database connected successfully')
);

export default pool;

