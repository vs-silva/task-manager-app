import {faker} from "@faker-js/faker";
import {TaskPriorityConstants} from "../integration/tasks/core/constants/task-priority.constants";

export default [
    {
        id: faker.datatype.uuid(),
        title: faker.random.words(2),
        description: faker.random.words(20),
        priority: TaskPriorityConstants.LOW,
        complete: faker.datatype.boolean()
    },
    {
        id: faker.datatype.uuid(),
        title: faker.random.words(3),
        description: faker.random.words(10),
        priority: TaskPriorityConstants.LOW,
        complete: faker.datatype.boolean()
    }
];
