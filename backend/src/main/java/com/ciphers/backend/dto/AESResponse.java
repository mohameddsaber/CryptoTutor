package com.ciphers.backend.dto;

import java.util.List;
import java.util.Map;

public class AESResponse {
    private String result;
    private List<Map<String, String>> steps;

    public AESResponse() {}

    public AESResponse(String result, List<Map<String, String>> steps) {
        this.result = result;
        this.steps = steps;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public List<Map<String, String>> getSteps() {
        return steps;
    }

    public void setSteps(List<Map<String, String>> steps) {
        this.steps = steps;
    }
}
