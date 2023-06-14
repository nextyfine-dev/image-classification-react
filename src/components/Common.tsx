import { capitalizeString } from "../services";

export const ResponsiveTableBody = ({
  data,
}: {
  data: Array<string | number | boolean>;
}) => {
  return (
    <tr>
      {data.map((d, i) => (
        <td className="px-3 py-4" key={i}>
          <div className="text-md">
            {typeof d === "string" ? capitalizeString(d) : d}
          </div>
        </td>
      ))}
    </tr>
  );
};

export const ResponsiveTable = ({
  tableHead,
  tableData,
}: {
  tableHead: string[];
  tableData: Array<string | number | boolean>[];
}) => {
  return (
    <div className="flex flex-col shadow-lg">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden border border-gray-700 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-200 dark:bg-gray-950">
                <tr>
                  {tableHead.map((data) => (
                    <th
                      key={data}
                      scope="col"
                      className="px-4 py-3.5 text-lg font-bold"
                    >
                      {data}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className=" divide-y divide-gray-700">
                {tableData.map((data, i) => (
                  <ResponsiveTableBody data={data} key={i} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
