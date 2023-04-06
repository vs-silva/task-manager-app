import {faker} from "@faker-js/faker";
import {TasksPriorityConstants} from "../integration/tasks/core/constants/tasks-priority.constants";

export default [
    {
        id: faker.datatype.uuid(),
        title: faker.random.words(2),
        description: faker.random.words(20),
        priority: TasksPriorityConstants.LOW,
        complete: faker.datatype.boolean()
    },
    {
        id: faker.datatype.uuid(),
        title: faker.random.words(3),
        description: faker.random.words(10),
        priority: TasksPriorityConstants.LOW,
        complete: faker.datatype.boolean()
    }
];
