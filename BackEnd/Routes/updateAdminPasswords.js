const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

async function updateAdminPasswords() {
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "your_password", // Thay bằng mật khẩu MySQL của bạn
        database: "veterina_vz",
    });

    try {
        const [admins] = await connection.execute("SELECT admin_id, admin_password FROM admin");
        for (const admin of admins) {
            const hashedPassword = await bcrypt.hash(admin.admin_password, 10);
            await connection.execute(
                "UPDATE admin SET admin_password = ? WHERE admin_id = ?",
                [hashedPassword, admin.admin_id]
            );
            console.log(`Updated password for admin_id ${admin.admin_id}`);
        }
    } catch (err) {
        console.error("Error updating passwords:", err);
    } finally {
        await connection.end();
    }
}

updateAdminPasswords();