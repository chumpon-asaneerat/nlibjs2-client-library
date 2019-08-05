CREATE TABLE #sp_who2_table(
	SPID INT,
	Status VARCHAR(MAX),
	LOGIN VARCHAR(MAX),
	HostName VARCHAR(MAX),
	BlkBy VARCHAR(MAX),
	DBName VARCHAR(MAX),
	Command VARCHAR(MAX),
	CPUTime INT,
	DiskIO INT,
	LastBatch VARCHAR(MAX),
	ProgramName VARCHAR(MAX),
	SPID_1 INT,
	REQUESTID INT
);

INSERT INTO #sp_who2_table EXEC sp_who2;

SELECT SPID, Command, ProgramName, CPUTime, DiskIO, REQUESTID
  FROM #sp_who2_table
 WHERE DBName = N'TestDb7x3';

DROP TABLE #sp_who2_table;