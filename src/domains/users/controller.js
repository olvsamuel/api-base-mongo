const bcrypt = require("bcrypt");
const { generateSha1, generateNumbers } = require('../../helper/functions')
const { sendMail } = require('../../helper/mail')
const UserSchema = require('../../schemas/UserSchema');
const ResetModel = require('../../schemas/ResetSchema')
const { CPF } = require('cpf_cnpj')


async function register(req, res) {
  try {
    const {
      email, name, phone, password,
      taxId, birthdate
    } = req.body;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    //split the full name to take the first and the last one
    const name_array = name.split(' ').slice();

    //validating the taxId (brazilian CPF)
    if (CPF.isValid(taxId)) return res.status(400).json({ error: true, message: 'Invalid taxId' });

    const userDoc = {
      name: name.trim(),
      first_name: name_array[0],
      last_name: name_array[name_array.length - 1],
      phone: phone.replace(/[^\d]+/g, ''),
      taxId: taxId.replace(/[^\d]+/g, ''),
      email: email,
      password: hashedPassword,
      salt: salt,
      birthdate: birthdate,
      active: true,
    }


    const user = await UserSchema.create(userDoc);

    // resp 201 - user created created
    return res.status(201).json({
      status: "ok",
      response: {
        name: nome,
        first_name: name_array[0],
        last_name: name_array[name_array.length - 1],
        phone: phone.replace(/[^\d]+/g, ''),
      }
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}

async function list(req, res) {
  try {
    const { page, limit, search, full } = req.query;

    // query searching user by your email or name
    const query = {
      active: true,
      $or: [
        { name: { $regex: `${search || ""}`, $options: 'i' } },
        { email: { $regex: `${search || ""}`, $options: 'i' } }
      ]
    }

    if (full) {
      const users = await UserSchema.find({ active: true }).select(['-password', '-salt']);

      return res.status(200).json(users);
    } else {
      const usrs = await UserSchema.paginate(query, { select: '-password -salt', page: page ? +page : 1, limit: limit ? +limit : 15 })
      return res.status(200).json(usrs);
    }

  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}

async function list_id(req, res) {
  try {
    const { id } = req.params;

    const user = await UserSchema.findOne({ active: true, _id: id }).select(['-password', '-salt']);

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}

async function change(req, res) {
  try {
    const { id } = req.params;
    const { name, email, phone, active } = req.body;

    const usuario = await UserSchema.findById(id).select(['-password', '-salt']);
    usuario.name = name;
    usuario.email = email.toLowerCase();
    usuario.phone = phone.replace(/[^\d]+/g, '');
    usuario.active = active;

    await usuario.save();

    return res.status(200).json({ message: 'successfully changed' });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}

async function deactivate(req, res) {
  try {
    const { id } = req.params;

    const user = await UserSchema.findById(id);

    user.active = false;

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}

async function activate(req, res) {
  try {
    const { id } = req.params;

    const user = await UserSchema.findById(id);

    user.active = true;

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}

async function exclude(req, res) {
  try {
    const { id } = req.params;

    const user = await UserSchema.findByIdAndDelete(id);

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}

async function change_password(req, res) {

  try {

    const { oldpassword, password, confirmation } = req.body;

    const { id } = req.params;

    const user = await UserSchema.findById(id);

    const hashedPassword = await bcrypt.hash(oldpassword, user.salt);

    if (hashedPassword !== user.password) {
      return res.status(400).json({ error: true, message: "A senha antiga não confere!" });
    }

    if (password !== confirmation) {
      return res.status(400).json({ error: true, message: "A nova senha e a confirmação não conferem!" });
    }

    const newHashedPassword = await bcrypt.hash(password, user.salt);

    user.password = newHashedPassword;

    await user.save();

    return res.status(200).json('ok');

  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}

async function reset_pwd(req, res) {
  try {
    const { hash } = req.params;
    const reset = await ResetModel.findOne({ hash: hash, used: false })

    if (!reset) return res.status(404).json({ error: true, message: 'Ivalid or used token' })

    reset.used = true
    await reset.save()

    const user = await UserSchema.findOne({ email: reset.email })
    const newPwd = generateNumbers(6)

    const newHashedPassword = await bcrypt.hash(newPwd, user.salt);

    user.password = newHashedPassword;
    await user.save();

    const respSendmail = sendMail(user.email, 'NEW PASSWORD',
      `
        <p>Hello ${user.name}, here is your new password:</p>
        <p>${novaSenha}</p>
      `
    )

    return res.status(200).json({ error: false, message: 'password sent' });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}

async function ask_reset_pwd(req, res) {
  try {
    const { email } = req.body

    const user = await UserSchema.findOne({ email: email.toLowerCase() })
    if (!user) return res.status(404).json({ error: true, message: "User not found" })

    const timestamp = new Date().getTime()
    const hash = generateSha1({ email: email.toLowerCase(), timestamp })

    // creating reset hash in database
    const resetObject = await ResetModel.create({ email: email.toLowerCase(), timestamp, hash, used: false })

    // taking the url to send on e-mail
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    const respSendmail = sendMail(email.toLowerCase(), 'RECUPERAÇÃO DE SENHA',
      `
    <p>Hello ${user.name}, you've request a new password</p>
    <p>Please, click the link bellow to confirm</p>
    <p>CONFIRMATION LINK: <a href='${fullUrl}/${hash}'>${fullUrl}/${hash}<a></p>
    `)


    return res.status(200).json({
      message: `Request sent to ${email.toLowerCase()}`
    });

  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}

module.exports = {
  list,
  list_id,
  register,
  change,
  deactivate,
  activate,
  exclude,
  change_password,
  ask_reset_pwd,
  reset_pwd
};
