package gov.uscis.rapidum.reqresponse;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;

/*
 * 	"CityState": "Altavista-VA",
		"Date": "12/06/2024",
		"Count": 1
 */
public class ReportDataList {

   @JsonProperty("CityState")
    @Schema(name="CityState", required= true, example="Altavista-VA")
    String cityState;

    @JsonProperty("Date")
    @Schema(name="Date", required= true, example="12/06/2024")
    String date;

    @JsonProperty("Count")
    @Schema(name="Count", required= true, example="1")
    int count;
    

}
