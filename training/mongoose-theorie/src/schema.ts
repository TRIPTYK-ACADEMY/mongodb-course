import { Model, model, Schema } from "mongoose";

class BlahBlah {
    private firstName: string;
    private lastName: string;

    set fullName(value) {
        this.firstName = value.split(' ')[0];
        this.lastName = value.split(' ')[1];
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`
    }
}


const blablah = new BlahBlah();
blablah.fullName = "test";


const addressSchema = new Schema({
    street: {
        type: String,

    },
    number: {
        type: Number
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    box: {
        type: String
    },
})

// défini la structure de l'instance du document
interface UserInterface {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    daysConnected: number,
    address: {
        street: string,
        number: number,
        country: string,
        city: string,
        box: string
    }
}

// l'interface qui défini les méthodes liées à l'instance du document
interface UserMethodsInterface {
    getFullName(): string;
}

// une virtuelle, équivalente à un getter/setter d'une classe
interface UserVirtualsInterface {
    fullName: string;
}

// interface qui défini les méthodes statiques liées au Modèle
interface UserStaticsInterface {
    findAndSave(id: string, data: Partial<UserInterface>): Promise<void>;
}

const schema = new Schema<
    // la structure du document
    UserInterface, 
    // le modèle
    Model<UserInterface>,
    // les méthodes
    UserMethodsInterface,
    {},
    UserVirtualsInterface,
    // les méthodes statiques
    UserStaticsInterface
>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    daysConnected: {
        required: false,
        type: Number,
        min: 0,
        max: 3000
    },
    address: {
        type: addressSchema
    }
}, {
    methods: {
        getFullName() {
            if (!this.firstName || !this.lastName) {
                return 'Anonymous';
            }
            return this._id + ' ' + this.firstName + ' ' + this.lastName;
        }
    },
    statics: {
        // récupère le record, le modifie et le sauvegarde
        async findAndSave(id: string, data: UserInterface) {
            const record = await this.findById(id);

            // mettre les propriétés de data dans le record
            Object.assign(record, data);

            await record.save();
        }
    },
    virtuals: {
        fullName: {
            get() {
                return `${this.firstName} + ${this.lastName}`;
            },
            set(value: string) {
                this.firstName = value.split(" ")[0];
                this.lastName = value.split(" ")[1];
            }
        }
    }
});

export const UserModel = model("users", schema);