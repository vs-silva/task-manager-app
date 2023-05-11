import {TasksService} from "./tasks.service";
//import {MockDataReaderAdapter} from "./adapters/mock-data-reader.adapter";
//import {MockDataWriterAdapter} from "./adapters/mock-data-writer.adapter";
import {RestApiWriterAdapter} from "./adapters/restapi-writer.adapter";
import {RestApiReaderAdapter} from "./adapters/restapi-reader.adapter";

export default TasksService(RestApiReaderAdapter(), RestApiWriterAdapter());
