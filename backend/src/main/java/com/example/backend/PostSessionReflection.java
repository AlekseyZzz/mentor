package com.example.backend;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class PostSessionReflection {
    @Id
    @GeneratedValue
    private Long id;
    private int minutesPlayed;

    public PostSessionReflection() {}

    public PostSessionReflection(int minutesPlayed) {
        this.minutesPlayed = minutesPlayed;
    }

    public Long getId() { return id; }
    public int getMinutesPlayed() { return minutesPlayed; }
    public void setMinutesPlayed(int minutesPlayed) { this.minutesPlayed = minutesPlayed; }
}
