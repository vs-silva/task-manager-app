import {TasksService} from "./tasks.service";
import {RestApiWriterAdapter} from "./adapters/restapi-writer.adapter";
import {RestApiReaderAdapter} from "./adapters/restapi-reader.adapter";

export default TasksService(RestApiReaderAdapter(), RestApiWriterAdapter());
